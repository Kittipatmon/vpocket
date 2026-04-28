<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())
            ->orWhereNull('user_id')
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        $walletTypes = \App\Models\WalletType::where('user_id', Auth::id())
            ->orWhereNull('user_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'walletTypes' => $walletTypes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $validated['user_id'] = Auth::id();

        Category::create($validated);

        return redirect()->back()->with('success', 'เพิ่มหมวดหมู่เรียบร้อยแล้ว');
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'อัปเดตหมวดหมู่เรียบร้อยแล้ว');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $category->delete();

        return redirect()->back()->with('success', 'ลบหมวดหมู่เรียบร้อยแล้ว');
    }
}
