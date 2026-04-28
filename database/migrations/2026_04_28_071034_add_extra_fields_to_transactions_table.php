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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('merchant')->nullable()->after('description');
            $table->string('payment_method')->nullable()->after('merchant');
            $table->text('tags')->nullable()->after('payment_method');
            $table->string('status')->default('completed')->after('tags');
            $table->boolean('is_recurring')->default(false)->after('status');
            $table->string('attachment_path')->nullable()->after('is_recurring');
            $table->boolean('is_essential')->nullable()->after('attachment_path');
            $table->string('type')->default('expense')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'merchant', 'payment_method', 'tags', 'status', 
                'is_recurring', 'attachment_path', 'is_essential'
            ]);
            $table->enum('type', ['income', 'expense', 'transfer'])->default('expense')->change();
        });
    }
};
