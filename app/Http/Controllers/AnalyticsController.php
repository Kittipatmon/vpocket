<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use App\Services\FinanceService;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    protected $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $selectedYear = $request->input('year', now()->year);
        
        // Get goals and other summary data from FinanceService
        $dashboardData = $this->financeService->getDashboardData($user);
        $goals = $dashboardData['goals'];
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

        // 3. Yearly Savings Trend (Monthly net savings based on Transaction Type: saving/investment)
        $savingsTrend = [];
        
        for ($m = 1; $m <= 12; $m++) {
            $month = Carbon::createFromDate($selectedYear, $m, 1);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            // Skip future months in current year
            if ($selectedYear == now()->year && $m > now()->month) {
                // break; 
            }

            // Sum all transactions that are categorized as 'saving' or 'investment'
            $monthlySaved = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [$start, $end])
                ->whereIn('type', ['saving', 'investment'])
                ->sum('amount');
            
            $savingsTrend[] = [
                'date' => $month->translatedFormat('M'),
                'savings' => (float)$monthlySaved 
            ];
        }

        return Inertia::render('Analytics/Index', [
            'monthlyData' => $monthlyData,
            'categoryData' => $categoryData,
            'savingsTrend' => $savingsTrend,
            'goals' => $goals,
            'filters' => [
                'year' => (int)$selectedYear
            ]
        ]);
    }
}
