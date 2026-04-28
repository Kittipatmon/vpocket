<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Expenses
        DB::table('categories')->where('name', 'Bills & Utilities')->update(['name' => 'บิลและค่าใช้จ่าย', 'icon' => '🧾', 'color' => '#ef4444']);
        DB::table('categories')->where('name', 'Entertainment')->update(['name' => 'ความบันเทิง', 'icon' => '🎬', 'color' => '#8b5cf6']);
        DB::table('categories')->where('name', 'Food & Drinks')->update(['name' => 'อาหารและเครื่องดื่ม', 'icon' => '🍔', 'color' => '#f59e0b']);
        DB::table('categories')->where('name', 'Health')->update(['name' => 'สุขภาพ', 'icon' => '🏥', 'color' => '#10b981']);
        DB::table('categories')->where('name', 'Investment')->where('type', 'expense')->update(['name' => 'การลงทุน', 'icon' => '📈', 'color' => '#3b82f6']);
        DB::table('categories')->where('name', 'Others')->where('type', 'expense')->update(['name' => 'อื่นๆ', 'icon' => '📦', 'color' => '#64748b']);
        DB::table('categories')->where('name', 'Shopping')->update(['name' => 'ช้อปปิ้ง', 'icon' => '🛍️', 'color' => '#ec4899']);
        DB::table('categories')->where('name', 'Transportation')->update(['name' => 'การเดินทาง', 'icon' => '🚗', 'color' => '#06b6d4']);

        // Incomes
        DB::table('categories')->where('name', 'Bonus')->update(['name' => 'โบนัส', 'icon' => '🎁', 'color' => '#f59e0b']);
        DB::table('categories')->where('name', 'Investments')->where('type', 'income')->update(['name' => 'ผลตอบแทนการลงทุน', 'icon' => '📊', 'color' => '#3b82f6']);
        DB::table('categories')->where('name', 'Others')->where('type', 'income')->update(['name' => 'รายได้อื่นๆ', 'icon' => '💰', 'color' => '#10b981']);
        DB::table('categories')->where('name', 'Salary')->update(['name' => 'เงินเดือน', 'icon' => '💵', 'color' => '#10b981']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to reverse specific names, but we can leave it.
    }
};
