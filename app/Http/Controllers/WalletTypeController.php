<?php

namespace App\Http\Controllers;

use App\Models\WalletType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletTypeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'classification' => 'required|string|in:spending,saving,investment',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $validated['user_id'] = Auth::id();

        WalletType::create($validated);

        return redirect()->back()->with('success', 'เพิ่มประเภทกระเป๋าเงินเรียบร้อยแล้ว');
    }

    public function update(Request $request, WalletType $walletType)
    {
        if ($walletType->user_id !== null && $walletType->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'classification' => 'required|string|in:spending,saving,investment',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $walletType->update($validated);
        
        if ($walletType->user_id === null) {
            $walletType->user_id = Auth::id();
            $walletType->save();
        }

        return redirect()->back()->with('success', 'อัปเดตประเภทกระเป๋าเงินเรียบร้อยแล้ว');
    }

    public function destroy(WalletType $walletType)
    {
        if ($walletType->user_id !== Auth::id()) {
            abort(403);
        }

        $walletType->delete();

        return redirect()->back()->with('success', 'ลบประเภทกระเป๋าเงินเรียบร้อยแล้ว');
    }
}
