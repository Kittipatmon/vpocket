<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wallet_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->timestamps();
        });

        // Insert default types
        DB::table('wallet_types')->insert([
            ['name' => 'เงินสด', 'icon' => '💵', 'color' => '#10b981', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'ออมทรัพย์', 'icon' => '🏦', 'color' => '#3b82f6', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'พร้อมเพย์', 'icon' => '📱', 'color' => '#06b6d4', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'บัตรเครดิต', 'icon' => '💳', 'color' => '#f59e0b', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'การลงทุน', 'icon' => '📈', 'color' => '#8b5cf6', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'อื่นๆ', 'icon' => '📁', 'color' => '#64748b', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_types');
    }
};
