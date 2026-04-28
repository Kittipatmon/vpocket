<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Budget;
use Carbon\Carbon;

class FinanceService
{
    /**
     * Get dashboard data for a specific user.
     */
    public function getDashboardData(User $user): array
    {
        $accounts = Account::where('user_id', $user->id)->get();
        $recentTransactions = Transaction::with('category', 'account')
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();
            
        $totalBalance = $accounts->sum('balance');
        
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        
        // Month-to-Date (MTD)
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonthSameDay = $now->copy()->subMonth(); 

        // Current Month Data
        $income = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');
            
        $expense = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        // Last Month MTD Data
        $lastMonthMTDExpense = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$startOfLastMonth, $endOfLastMonthSameDay])
            ->sum('amount');

        // Savings Data
        $savingsTypes = ['Savings', 'Fixed Deposit', 'Investment', 'ออมทรัพย์', 'ฝากประจำ', 'ลงทุน'];
        $totalSavings = $accounts->whereIn('type', $savingsTypes)->sum('balance');
        $savingsGoal = $user->savings_goal; 

        // Insights Data
        $topCategory = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->with('category')
            ->selectRaw('category_id, category_name, SUM(amount) as total')
            ->groupBy('category_id', 'category_name')
            ->orderByDesc('total')
            ->first();

        // Budget Status (Sample: use the first budget found or a generic one)
        $budget = Budget::where('user_id', $user->id)->first();
        $budgetInfo = null;
        if ($budget) {
            $spentInBudget = Transaction::where('user_id', $user->id)
                ->where('category_id', $budget->category_id)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->sum('amount');
            $budgetInfo = [
                'name' => $budget->category->name ?? 'Budget',
                'limit' => (float)$budget->amount,
                'spent' => (float)$spentInBudget,
                'remaining' => (float)($budget->amount - $spentInBudget)
            ];
        }

        return [
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
            'totalBalance' => (float)$totalBalance,
            'monthlyIncome' => (float)$income,
            'monthlyExpense' => (float)$expense,
            'lastMonthExpense' => (float)$lastMonthMTDExpense,
            'totalSavings' => (float)$totalSavings,
            'savingsGoal' => (float)$savingsGoal,
            'insights' => [
                'topCategory' => $topCategory ? [
                    'name' => $topCategory->category->name ?? $topCategory->category_name ?? 'อื่นๆ',
                    'amount' => (float)$topCategory->total,
                    'icon' => $topCategory->category->icon ?? '☕'
                ] : null,
                'budget' => $budgetInfo,
                'savingsPercent' => $savingsGoal > 0 ? round(($totalSavings / $savingsGoal) * 100) : 0
            ]
        ];
    }
}
