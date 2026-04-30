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
            ->orderBy('id', 'desc')
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

        // Get dynamic classifications from WalletType model
        $walletTypes = \App\Models\WalletType::all();
        
        $savingTypeNames = $walletTypes->where('classification', 'saving')->pluck('name')->toArray();
        $investmentTypeNames = $walletTypes->where('classification', 'investment')->pluck('name')->toArray();

        // Add legacy/common type names for backward compatibility
        $savingTypeNames = array_merge($savingTypeNames, ['Savings', 'Savings Account', 'bank', 'ออมทรัพย์']);
        $investmentTypeNames = array_merge($investmentTypeNames, ['Investment', 'Stock', 'Crypto', 'ลงทุน', 'การลงทุน', 'investment']);

        // Aggregate data using dynamic classifications
        $totalSavings = $accounts->whereIn('type', $savingTypeNames)->unique('id')->sum('balance');
        $totalInvestment = $accounts->whereIn('type', $investmentTypeNames)->unique('id')->sum('balance');

        // Goals Data
        $goals = $user->goals()->get();
        if ($goals->isEmpty()) {
            // Create default Saving Goal
            $savingGoal = $user->goals()->create([
                'name' => 'การออม',
                'type' => 'saving',
                'target_amount' => $user->savings_goal ?: 100000,
                'current_amount' => $totalSavings,
                'icon' => '🏦',
                'color' => '#10b981'
            ]);
            
            // Create default Investment Goal
            $investmentGoal = $user->goals()->create([
                'name' => 'การลงทุน',
                'type' => 'investment',
                'target_amount' => 100000,
                'current_amount' => $totalInvestment,
                'icon' => '📈',
                'color' => '#3b82f6'
            ]);
            
            $goals = collect([$savingGoal, $investmentGoal]);
        } else {
            // Update current amounts dynamically
            foreach ($goals as $goal) {
                if ($goal->account_id) {
                    // Link to specific account balance
                    $linkedAccount = $accounts->firstWhere('id', $goal->account_id);
                    if ($linkedAccount) {
                        $goal->current_amount = $linkedAccount->balance;
                    }
                } else {
                    // Fallback to type-based aggregation
                    if ($goal->type === 'saving' || $goal->name === 'การออม') {
                        $goal->current_amount = $totalSavings;
                    } elseif ($goal->type === 'investment' || $goal->name === 'การลงทุน') {
                        $goal->current_amount = $totalInvestment;
                    }
                }
                
                // Only save if dirty to avoid unnecessary queries
                if ($goal->isDirty('current_amount')) {
                    $goal->save();
                }
            }
        }
        
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
            'spendableBalance' => (float)($totalBalance - ($totalSavings + $totalInvestment)),
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
            ],
            'goals' => $goals
        ];
    }
}
