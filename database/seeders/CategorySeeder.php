<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Expenses
            ['name' => 'Food & Drinks', 'type' => 'expense', 'icon' => 'utensils', 'color' => '#FFADAD'],
            ['name' => 'Transportation', 'type' => 'expense', 'icon' => 'car', 'color' => '#FFD6A5'],
            ['name' => 'Shopping', 'type' => 'expense', 'icon' => 'shopping-bag', 'color' => '#FDFFB6'],
            ['name' => 'Entertainment', 'type' => 'expense', 'icon' => 'film', 'color' => '#CAFFBF'],
            ['name' => 'Bills & Utilities', 'type' => 'expense', 'icon' => 'file-invoice', 'color' => '#9BF6FF'],
            ['name' => 'Health', 'type' => 'expense', 'icon' => 'heartbeat', 'color' => '#A0C4FF'],
            ['name' => 'Investment', 'type' => 'expense', 'icon' => 'chart-line', 'color' => '#BDB2FF'],
            ['name' => 'Others', 'type' => 'expense', 'icon' => 'ellipsis-h', 'color' => '#FFC6FF'],

            // Income
            ['name' => 'Salary', 'type' => 'income', 'icon' => 'wallet', 'color' => '#9DFFA3'],
            ['name' => 'Bonus', 'type' => 'income', 'icon' => 'gift', 'color' => '#FFFFA3'],
            ['name' => 'Investments', 'type' => 'income', 'icon' => 'chart-pie', 'color' => '#A3C4FF'],
            ['name' => 'Others', 'type' => 'income', 'icon' => 'coins', 'color' => '#FFA3F6'],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
