<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Account;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $query = Transaction::with(['category', 'account'])
            ->where('user_id', auth()->id())
            ->whereBetween('date', [$startDate, $endDate]);

        $allTransactions = $query->get();
        $transactions = (clone $query)->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Summary Calculations (Based on ALL transactions in period)
        $summary = [
            'total_income' => (float)$allTransactions->where('type', 'income')->sum('amount'),
            'total_expense' => (float)$allTransactions->where('type', 'expense')->sum('amount'),
            'total_saving' => (float)$allTransactions->where('type', 'saving')->sum('amount'),
            'total_investment' => (float)$allTransactions->where('type', 'investment')->sum('amount'),
            'net_balance' => (float)$allTransactions->where('type', 'income')->sum('amount') 
                           - $allTransactions->where('type', 'expense')->sum('amount')
                           - $allTransactions->where('type', 'saving')->sum('amount')
                           - $allTransactions->where('type', 'investment')->sum('amount')
        ];

        // Group by category for chart/breakdown
        $categoryBreakdown = $allTransactions->where('type', 'expense')
            ->groupBy('category_id')
            ->map(function ($group) {
                return [
                    'name' => $group->first()->category->name ?? $group->first()->category_name ?? 'Other',
                    'amount' => (float)$group->sum('amount'),
                    'color' => $group->first()->category->color ?? '#cbd5e1'
                ];
            })->values();

        return Inertia::render('Reports/Index', [
            'transactions' => $transactions,
            'accounts' => auth()->user()->accounts,
            'summary' => $summary,
            'categoryBreakdown' => $categoryBreakdown,
            'filters' => [
                'month' => (int)$month,
                'year' => (int)$year
            ],
            'categories' => \App\Models\Category::where('user_id', auth()->id())
                ->orWhereNull('user_id')
                ->get()
        ]);
    }
}
