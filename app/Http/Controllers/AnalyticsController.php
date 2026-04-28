<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $selectedYear = $request->input('year', now()->year);
        
        // 1. Monthly Income vs Expense (All months in selected year)
        $monthlyData = [];
        for ($m = 1; $m <= 12; $m++) {
            $month = Carbon::createFromDate($selectedYear, $m, 1);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $income = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('date', [$start, $end])
                ->sum('amount');

            $expense = Transaction::where('user_id', $user->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$start, $end])
                ->sum('amount');

            $monthlyData[] = [
                'name' => $month->translatedFormat('M'),
                'income' => (float)$income,
                'expense' => (float)$expense,
            ];
        }

        // 2. Category Breakdown (Selected Year)
        $categoryData = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereYear('date', $selectedYear)
            ->with('category')
            ->select('category_id', DB::raw('SUM(amount) as value'))
            ->groupBy('category_id')
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->category->name ?? 'อื่นๆ',
                    'value' => (float)$item->value,
                    'color' => $item->category->color ?? '#3b82f6'
                ];
            });

        // 3. Yearly Savings Trend (Monthly net balance over the year)
        $savingsTrend = [];
        $runningBalance = 0;
        // Start from initial balance before this year (optional, but let's keep it relative to year start)
        for ($m = 1; $m <= 12; $m++) {
            $month = Carbon::createFromDate($selectedYear, $m, 1);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $monthlyNet = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [$start, $end])
                ->whereIn('type', ['income', 'expense'])
                ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net")
                ->value('net') ?? 0;
            
            $runningBalance += $monthlyNet;
            $savingsTrend[] = [
                'date' => $month->translatedFormat('M'),
                'balance' => (float)$runningBalance
            ];
        }

        return Inertia::render('Analytics/Index', [
            'monthlyData' => $monthlyData,
            'categoryData' => $categoryData,
            'savingsTrend' => $savingsTrend,
            'filters' => [
                'year' => (int)$selectedYear
            ]
        ]);
    }
}
