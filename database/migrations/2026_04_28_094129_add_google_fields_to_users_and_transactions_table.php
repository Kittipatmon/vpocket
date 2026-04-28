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
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->after('id');
            $table->text('google_token')->nullable()->after('google_id');
            $table->text('google_refresh_token')->nullable()->after('google_token');
            $table->string('google_drive_folder_id')->nullable()->after('google_refresh_token');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->string('google_drive_file_id')->nullable()->after('attachment_path');
            $table->text('ocr_raw_text')->nullable()->after('google_drive_file_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'google_token', 'google_refresh_token', 'google_drive_folder_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['google_drive_file_id', 'ocr_raw_text']);
        });
    }
};
