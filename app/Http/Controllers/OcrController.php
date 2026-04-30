<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OcrService;
use App\Models\Transaction;
use App\Models\Account;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class OcrController extends Controller
{
    protected $ocrService;

    public function __construct(OcrService $ocrService)
    {
        $this->ocrService = $ocrService;
    }

    public function scan(Request $request)
    {
        $request->validate([
            'slips' => 'required|array',
            'slips.*' => 'image|mimes:jpeg,png,jpg|max:5120', // Max 5MB per image
            'account_id' => 'required|exists:accounts,id'
        ]);

        $results = [];
        $accountId = $request->account_id;
        $userId = auth()->id();

        foreach ($request->file('slips') as $slip) {
            $path = $slip->store('slips', 'public');
            $fullPath = storage_path('app/public/' . $path);

            $ocrData = $this->ocrService->scanSlip($fullPath, auth()->user());

            if ($ocrData && $ocrData['success']) {
                DB::transaction(function() use ($userId, $accountId, $ocrData, $path, &$results) {
                    // Try to find a default category more robustly
                    $category = Category::where(function($q) use ($userId) {
                            $q->where('user_id', $userId)
                              ->orWhereNull('user_id');
                        })
                        ->where('type', 'expense')
                        ->where(function($q) {
                            $q->where('name', 'LIKE', '%อื่น%')
                              ->orWhere('name', 'LIKE', '%ทั่วไป%')
                              ->orWhere('name', 'LIKE', '%บิล%')
                              ->orWhere('name', 'LIKE', '%General%')
                              ->orWhere('name', 'LIKE', '%Misc%');
                        })
                        ->first();

                    // If still not found, just take any expense category
                    if (!$category) {
                        $category = Category::where(function($q) use ($userId) {
                            $q->where('user_id', $userId)
                              ->orWhereNull('user_id');
                        })->where('type', 'expense')->first();
                    }

                    // Create transaction
                    $transaction = Transaction::create([
                        'user_id' => $userId,
                        'account_id' => $accountId,
                        'category_id' => $category ? $category->id : null,
                        'amount' => $ocrData['amount'],
                        'type' => 'expense',
                        'description' => 'สแกนสลิป: ' . ($ocrData['bank'] !== 'Unknown' ? $ocrData['bank'] : 'ไม่ทราบธนาคาร'),
                        'date' => $ocrData['date'],
                        'attachment_path' => $path,
                        'ocr_raw_text' => $ocrData['raw_text'],
                        'status' => 'completed'
                    ]);

                    // Update account balance (OCR slips are expenses)
                    Account::find($accountId)->decrement('balance', $ocrData['amount']);

                    $results[] = [
                        'success' => true,
                        'transaction' => $transaction,
                        'ocr_data' => $ocrData
                    ];
                });
            } else {
                $results[] = [
                    'success' => false,
                    'error' => $ocrData['error'] ?? 'Could not process image',
                    'filename' => $slip->getClientOriginalName()
                ];
            }
        }

        return response()->json([
            'message' => 'Processing complete',
            'results' => $results
        ]);
    }
}
