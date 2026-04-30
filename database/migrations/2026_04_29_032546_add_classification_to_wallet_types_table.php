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
        Schema::table('wallet_types', function (Blueprint $table) {
            $table->string('classification')->default('spending')->after('name');
        });
        
        // Update existing types based on names
        DB::table('wallet_types')->where('name', 'like', '%ออม%')->update(['classification' => 'saving']);
        DB::table('wallet_types')->where('name', 'like', '%ลงทุน%')->update(['classification' => 'investment']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallet_types', function (Blueprint $table) {
            $table->dropColumn('classification');
        });
    }
};
