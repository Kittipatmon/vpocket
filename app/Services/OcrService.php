<?php

namespace App\Services;

use thiagoalessio\TesseractOCR\TesseractOCR;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\User;
use Google\Client;
use Google\Service\Drive;

class OcrService
{
    protected $tesseractExecutable = 'C:\Program Files\Tesseract-OCR\tesseract.exe';
    protected $ocrSpaceApiKey = null; // Will use OCR_SPACE_API_KEY from .env
    protected $googleDriveService;

    public function scanSlip($imagePath, User $user = null)
    {
        try {
            // 1. Try Tesseract first if available
            $isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
            $tesseractExists = $isWindows ? file_exists($this->tesseractExecutable) : true; // Assume exists on linux if installed via apt

            if ($tesseractExists) {
                try {
                    $ocr = new TesseractOCR($imagePath);
                    
                    if ($isWindows) {
                        $ocr->executable($this->tesseractExecutable);
                    }

                    $text = $ocr->lang('tha', 'eng')->run();
                    if (trim($text)) {
                        return $this->parseSlipData($text);
                    }
                } catch (\Exception $e) {
                    Log::warning('Tesseract failed, trying other methods: ' . $e->getMessage());
                }
            }

            // 2. Try OCR.space API (Zero installation)
            $apiKey = config('services.ocr_space.api_key');
            if ($apiKey) {
                $ocrData = $this->scanWithOcrSpace($imagePath);
                if ($ocrData && $ocrData['success'] && !empty($ocrData['raw_text'])) {
                    return $ocrData;
                }
            }

            // 3. Fallback to Google Drive OCR if user is provided and has token
            if ($user && $user->google_token) {
                return $this->scanWithGoogleDrive($imagePath, $user);
            }

            throw new \Exception("All OCR methods failed. Please install Tesseract or connect Google account.");
        } catch (\Exception $e) {
            Log::error('OCR Error: ' . $e->getMessage());
            return [
                'raw_text' => '',
                'error' => $e->getMessage(),
                'success' => false
            ];
        }
    }

    public function scanWithOcrSpace($imagePath)
    {
        try {
            $apiKey = config('services.ocr_space.api_key', $this->ocrSpaceApiKey);
            
            // Try with Engine 2 first (Better for many languages including Thai)
            $response = \Illuminate\Support\Facades\Http::attach(
                'file', fopen($imagePath, 'r'), basename($imagePath)
            )->post('https://api.ocr.space/parse/image', [
                'apikey' => $apiKey,
                'language' => 'tha',
                'isOverlayRequired' => 'false',
                'detectOrientation' => 'true',
                'scale' => 'true',
                'isTable' => 'true',
                'OCREngine' => '2' // Engine 2 is often better for structured text
            ]);

            if ($response->failed()) {
                throw new \Exception('OCR.space request failed: ' . $response->reason());
            }

            $result = $response->json();

            // Handle Engine 2 busy or other errors by falling back to Engine 1
            if (isset($result['OCRExitCode']) && $result['OCRExitCode'] > 1) {
                 $response = \Illuminate\Support\Facades\Http::attach(
                    'file', fopen($imagePath, 'r'), basename($imagePath)
                )->post('https://api.ocr.space/parse/image', [
                    'apikey' => $apiKey,
                    'language' => 'tha',
                    'isOverlayRequired' => 'false',
                    'detectOrientation' => 'true',
                    'scale' => 'true',
                    'OCREngine' => '1'
                ]);
                $result = $response->json();
            }

            if (isset($result['ParsedResults'][0]['ParsedText'])) {
                $text = $result['ParsedResults'][0]['ParsedText'];
                return $this->parseSlipData($text);
            }

            $errorMsg = $result['ErrorMessage'][0] ?? 'Unknown error from OCR.space';
            throw new \Exception($errorMsg);
        } catch (\Exception $e) {
            Log::error('OCR.space Error: ' . $e->getMessage());
            return [
                'raw_text' => '',
                'error' => 'OCR.space failed: ' . $e->getMessage(),
                'success' => false
            ];
        }
    }

    public function scanWithGoogleDrive($imagePath, User $user)
    {
        try {
            $client = new Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->setAccessToken($user->google_token);

            if ($client->isAccessTokenExpired()) {
                if ($user->google_refresh_token) {
                    $newToken = $client->fetchAccessTokenWithRefreshToken($user->google_refresh_token);
                    $user->update(['google_token' => $newToken['access_token']]);
                } else {
                    throw new \Exception('Google access token expired.');
                }
            }

            $driveService = new Drive($client);
            
            // Upload as Google Doc to trigger OCR
            $fileMetadata = new Drive\DriveFile([
                'name' => 'Vpocket_OCR_Temp_' . time(),
                'mimeType' => 'application/vnd.google-apps.document'
            ]);

            $content = file_get_contents($imagePath);
            $file = $driveService->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => 'image/jpeg',
                'uploadType' => 'multipart',
                'fields' => 'id'
            ]);

            // Export as text/plain
            $response = $driveService->files->export($file->id, 'text/plain', ['alt' => 'media']);
            $text = $response->getBody()->getContents();

            // Cleanup
            $driveService->files->delete($file->id);

            return $this->parseSlipData($text);
        } catch (\Exception $e) {
            Log::error('Google Drive OCR Error: ' . $e->getMessage());
            return [
                'raw_text' => '',
                'error' => 'Google Drive OCR failed: ' . $e->getMessage(),
                'success' => false
            ];
        }
    }

    protected function parseSlipData($text)
    {
        // Normalize text: remove multiple spaces, normalize Thai characters
        $text = preg_replace('/\s+/', ' ', $text);
        
        $data = [
            'raw_text' => $text,
            'amount' => 0,
            'date' => now()->format('Y-m-d'),
            'bank' => 'Unknown',
            'receiver' => null,
            'success' => true
        ];

        // 1. Amount Extraction - Improved patterns for Thai Banks
        // K-Bank/SCB often use "จำนวนเงิน" or "Amount"
        // Try multiple patterns
        $amountPatterns = [
            '/(?:จำนวนเงิน|จํานวนเงิน|Amount|Total|ยอดเงิน)\s*[:]?\s*([\d,]+\.?\d{0,2})/ui',
            '/([\d,]+\.\d{2})\s*(?:บาท|THB)/ui',
            '/(?:โอนเงิน|ชำระเงิน)\s*([\d,]+\.\d{2})/ui',
        ];

        foreach ($amountPatterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $data['amount'] = (float) str_replace(',', '', $matches[1]);
                if ($data['amount'] > 0) break;
            }
        }

        // If still 0, look for the largest number that looks like an amount (X.XX)
        if ($data['amount'] == 0) {
            if (preg_match_all('/([\d,]+\.\d{2})/', $text, $matches)) {
                $amounts = array_map(function($val) {
                    return (float) str_replace(',', '', $val);
                }, $matches[1]);
                if (!empty($amounts)) {
                    $data['amount'] = max($amounts);
                }
            }
        }

        // 2. Date Extraction - More robust Thai months
        $thaiMonths = [
            'ม.ค.' => '01', 'ก.พ.' => '02', 'มี.ค.' => '03', 'เม.ย.' => '04', 'พ.ค.' => '05', 'มิ.ย.' => '06',
            'ก.ค.' => '07', 'ส.ค.' => '08', 'ก.ย.' => '09', 'ต.ค.' => '10', 'พ.ย.' => '11', 'ธ.ค.' => '12',
            'มกราคม' => '01', 'กุมภาพันธ์' => '02', 'มีนาคม' => '03', 'เมษายน' => '04', 'พฤษภาคม' => '05', 'มิถุนายน' => '06',
            'กรกฎาคม' => '07', 'สิงหาคม' => '08', 'กันยายน' => '09', 'ตุลาคม' => '10', 'พฤศจิกายน' => '11', 'ธันวาคม' => '12'
        ];

        // Pattern 1: 29 เม.ย. 67 or 29 เมษายน 2567
        if (preg_match('/(\d{1,2})\s*([ก-์\.]+)\s*(\d{2,4})/', $text, $matches)) {
            $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
            $monthText = $matches[2];
            $year = $matches[3];

            // Normalize month text (remove dots etc)
            foreach ($thaiMonths as $mName => $mNum) {
                if (mb_stripos($monthText, $mName) !== false) {
                    $month = $mNum;
                    if (strlen($year) == 2) {
                        $year = '20' . $year;
                    } elseif ($year > 2500) {
                        $year = $year - 543;
                    }
                    $data['date'] = "$year-$month-$day";
                    break;
                }
            }
        } 
        // Pattern 2: DD/MM/YYYY or DD/MM/YY
        elseif (preg_match('/(\d{2})\/(\d{2})\/(\d{2,4})/', $text, $matches)) {
            $year = $matches[3];
            if (strlen($year) == 2) $year = '20' . $year;
            if ($year > 2500) $year = $year - 543;
            $data['date'] = "$year-{$matches[2]}-{$matches[1]}";
        }

        // 3. Bank Identification
        $banks = [
            'K-Bank' => ['K-Bank', 'Kasikorn', 'กสิกร'],
            'SCB' => ['SCB', 'Siam Commercial', 'ไทยพาณิชย์'],
            'Krungthai' => ['Krungthai', 'KTB', 'กรุงไทย'],
            'Bangkok Bank' => ['Bangkok Bank', 'BBL', 'กรุงเทพ'],
            'Krungsri' => ['Krungsri', 'BAY', 'กรุงศรี'],
            'TMBThanachart' => ['TMB', 'TTB', 'Thanachart', 'ทหารไทย'],
            'UOB' => ['UOB', 'ยูโอบี'],
            'GSB' => ['GSB', 'ออมสิน'],
            'PromptPay' => ['PromptPay', 'พร้อมเพย์'],
            'ShopeePay' => ['ShopeePay', 'ช้อปปี้'],
            'TrueMoney' => ['TrueMoney', 'ทรูมันนี่'],
        ];

        foreach ($banks as $name => $keywords) {
            foreach ($keywords as $keyword) {
                if (mb_stripos($text, $keyword) !== false) {
                    $data['bank'] = $name;
                    break 2;
                }
            }
        }

        // Final check: if amount is still 0, it might be a failure to parse, but we return success if we got text
        if (empty(trim($text))) {
            $data['success'] = false;
            $data['error'] = 'Could not extract text from image';
        }

        return $data;
    }
}
