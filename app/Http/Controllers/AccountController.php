<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AccountController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'currency' => 'required|string|size:3',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('accounts', 'public');
            $validated['image_path'] = $path;
        }

        Auth::user()->accounts()->create($validated);

        return redirect()->back()->with('success', 'สร้างกระเป๋าเงินเรียบร้อยแล้ว');
    }

    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'currency' => 'required|string|size:3',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($account->image_path) {
                Storage::disk('public')->delete($account->image_path);
            }
            $path = $request->file('image')->store('accounts', 'public');
            $validated['image_path'] = $path;
        }

        $account->update($validated);

        return redirect()->back()->with('success', 'อัปเดตกระเป๋าเงินเรียบร้อยแล้ว');
    }

    public function destroy(Account $account)
    {
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        if ($account->image_path) {
            Storage::disk('public')->delete($account->image_path);
        }

        $account->delete();

        return redirect()->back()->with('success', 'ลบกระเป๋าเงินเรียบร้อยแล้ว');
    }
}
