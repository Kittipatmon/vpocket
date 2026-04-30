<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'category_name' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense,transfer,saving,investment',
            'description' => 'nullable|string|max:255',
            'merchant' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'status' => 'nullable|string',
            'is_recurring' => 'nullable|boolean',
            'is_essential' => 'nullable|boolean',
            'date' => 'required|date',
            'to_account_id' => 'required_if:type,transfer|nullable|exists:accounts,id',
        ]);

        DB::transaction(function () use ($validated) {
            $user = Auth::user();
            $transaction = $user->transactions()->create($validated);

            // Update account balance
            $account = Account::find($validated['account_id']);

            // Core balance logic
            if ($validated['type'] === 'income') {
                $account->increment('balance', $validated['amount']);
            } else {
                // expense, transfer, saving, investment all reduce the source account balance
                $account->decrement('balance', $validated['amount']);

                // If it's a transfer (or a saving/investment with a destination account)
                if (in_array($validated['type'], ['transfer', 'saving', 'investment']) && !empty($validated['to_account_id'])) {
                    $toAccount = Account::find($validated['to_account_id']);
                    $toAccount->increment('balance', $validated['amount']);
                }
            }
        });

        return redirect()->back()->with('success', 'บันทึกรายการเรียบร้อยแล้ว');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'category_name' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense,transfer,saving,investment',
            'description' => 'nullable|string|max:255',
            'merchant' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'status' => 'nullable|string',
            'is_recurring' => 'nullable|boolean',
            'is_essential' => 'nullable|boolean',
            'date' => 'required|date',
            'to_account_id' => 'required_if:type,transfer|nullable|exists:accounts,id',
        ]);

        DB::transaction(function () use ($validated, $transaction) {
            // 1. Reverse the old transaction balance impact
            $oldAccount = Account::find($transaction->account_id);
            if ($transaction->type === 'income') {
                $oldAccount->decrement('balance', $transaction->amount);
            } else {
                $oldAccount->increment('balance', $transaction->amount);
                if (in_array($transaction->type, ['transfer', 'saving', 'investment']) && $transaction->to_account_id) {
                    Account::find($transaction->to_account_id)->decrement('balance', $transaction->amount);
                }
            }

            // 2. Update the transaction
            $transaction->update($validated);

            // 3. Apply the new transaction balance impact
            $newAccount = Account::find($validated['account_id']);
            if ($validated['type'] === 'income') {
                $newAccount->increment('balance', $validated['amount']);
            } else {
                $newAccount->decrement('balance', $validated['amount']);
                if (in_array($validated['type'], ['transfer', 'saving', 'investment']) && !empty($validated['to_account_id'])) {
                    Account::find($validated['to_account_id'])->increment('balance', $validated['amount']);
                }
            }
        });

        return redirect()->back()->with('success', 'แก้ไขรายการเรียบร้อยแล้ว');
    }

    public function destroy(Transaction $transaction)
    {
        DB::transaction(function () use ($transaction) {
            $account = Account::find($transaction->account_id);

            if ($transaction->type === 'income') {
                $account->decrement('balance', $transaction->amount);
            } else {
                $account->increment('balance', $transaction->amount);
                if (in_array($transaction->type, ['transfer', 'saving', 'investment']) && $transaction->to_account_id) {
                    Account::find($transaction->to_account_id)->decrement('balance', $transaction->amount);
                }
            }

            $transaction->delete();
        });

        return redirect()->back()->with('success', 'ลบรายการเรียบร้อยแล้ว');
    }
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:transactions,id'
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->ids as $id) {
                $transaction = Transaction::find($id);
                if ($transaction->user_id !== Auth::id())
                    continue;

                $account = Account::find($transaction->account_id);

                if ($transaction->type === 'income') {
                    $account->decrement('balance', $transaction->amount);
                } else {
                    $account->increment('balance', $transaction->amount);
                    if (in_array($transaction->type, ['transfer', 'saving', 'investment']) && $transaction->to_account_id) {
                        Account::find($transaction->to_account_id)->decrement('balance', $transaction->amount);
                    }
                }

                $transaction->delete();
            }
        });

        return redirect()->back()->with('success', 'ลบรายการที่เลือกเรียบร้อยแล้ว');
    }
}
