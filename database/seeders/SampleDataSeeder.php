<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::first();
        if (!$user) return;

        // Accounts
        $bank = \App\Models\Account::create([
            'user_id' => $user->id,
            'name' => 'KBank Main',
            'type' => 'bank',
            'balance' => 45000.00,
            'currency' => 'THB',
            'color' => '#A0C4FF',
            'icon' => 'university',
        ]);

        $cash = \App\Models\Account::create([
            'user_id' => $user->id,
            'name' => 'Physical Wallet',
            'type' => 'cash',
            'balance' => 2500.00,
            'currency' => 'THB',
            'color' => '#FFADAD',
            'icon' => 'wallet',
        ]);

        $ewallet = \App\Models\Account::create([
            'user_id' => $user->id,
            'name' => 'TrueMoney',
            'type' => 'e_wallet',
            'balance' => 1250.50,
            'currency' => 'THB',
            'color' => '#FFD6A5',
            'icon' => 'mobile-alt',
        ]);

        // Categories
        $foodCat = \App\Models\Category::where('name', 'Food & Drinks')->first();
        $salaryCat = \App\Models\Category::where('name', 'Salary')->first();
        $billCat = \App\Models\Category::where('name', 'Bills & Utilities')->first();

        // Transactions
        \App\Models\Transaction::create([
            'user_id' => $user->id,
            'account_id' => $bank->id,
            'category_id' => $salaryCat->id,
            'amount' => 50000.00,
            'type' => 'income',
            'description' => 'Monthly Salary',
            'date' => now()->startOfMonth(),
        ]);

        \App\Models\Transaction::create([
            'user_id' => $user->id,
            'account_id' => $bank->id,
            'category_id' => $billCat->id,
            'amount' => 3500.00,
            'type' => 'expense',
            'description' => 'Electricity Bill',
            'date' => now()->subDays(5),
        ]);

        \App\Models\Transaction::create([
            'user_id' => $user->id,
            'account_id' => $cash->id,
            'category_id' => $foodCat->id,
            'amount' => 120.00,
            'type' => 'expense',
            'description' => 'Lunch at Market',
            'date' => now(),
        ]);

        \App\Models\Transaction::create([
            'user_id' => $user->id,
            'account_id' => $ewallet->id,
            'category_id' => $foodCat->id,
            'amount' => 450.00,
            'type' => 'expense',
            'description' => 'Dinner with Friends',
            'date' => now()->subDay(),
        ]);
    }
}
