<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Goal;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string',
            'account_id' => 'nullable|exists:accounts,id',
            'target_amount' => 'required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'deadline' => 'nullable|date',
        ]);

        Auth::user()->goals()->create($validated);

        return redirect()->back()->with('success', 'เพิ่มเป้าหมายเรียบร้อยแล้ว');
    }

    public function update(Request $request, Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string',
            'account_id' => 'nullable|exists:accounts,id',
            'target_amount' => 'required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'deadline' => 'nullable|date',
        ]);

        $goal->update($validated);

        return redirect()->back()->with('success', 'อัปเดตเป้าหมายเรียบร้อยแล้ว');
    }

    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $goal->delete();

        return redirect()->back()->with('success', 'ลบเป้าหมายเรียบร้อยแล้ว');
    }
}
