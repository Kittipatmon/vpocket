<?php

namespace App\Services;

use thiagoalessio\TesseractOCR\TesseractOCR;
use Illuminate\Support\Facades\Log;

class OcrService
{
    public function scan($imagePath)
    {
        try {
            $ocr = new TesseractOCR($imagePath);
            
            // On Windows, we often need to specify the path if not in PATH
            // Common XAMPP/Windows paths
            $tesseractPaths = [
                'C:\Program Files\Tesseract-OCR\tesseract.exe',
                'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            ];

            foreach ($tesseractPaths as $path) {
                if (file_exists($path)) {
                    $ocr->executable($path);
                    break;
                }
            }

            $text = $ocr->lang('tha', 'eng')->run();
            
            return $this->parseSlipData($text);
        } catch (\Exception $e) {
            Log::error('OCR Scan Error: ' . $e->getMessage());
            return null;
        }
    }

    private function parseSlipData($text)
    {
        // Simple regex to find amounts and dates
        // amount usually has decimals or is a large number
        // This is a basic implementation and might need tuning for different banks
        
        $data = [
            'amount' => 0,
            'date' => now()->format('Y-m-d'),
            'raw' => $text
        ];

        // Search for amount (e.g., 120.00, 1,200.00)
        if (preg_match('/([0-9,]+\.[0-9]{2})/', $text, $matches)) {
            $data['amount'] = (float) str_replace(',', '', $matches[1]);
        } elseif (preg_match('/([0-9,]+)\s?บาท/u', $text, $matches)) {
            $data['amount'] = (float) str_replace(',', '', $matches[1]);
        }

        // Search for date (DD MMM YY or similar)
        // This part is tricky with Thai months, we might just default to today if not sure
        
        return $data;
    }
}
