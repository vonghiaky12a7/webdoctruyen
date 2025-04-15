<?php

// File migration (ví dụ: database/migrations/2025_04_03_update_personal_refresh_tokens_table_for_uuid.php)
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePersonalRefreshTokensTableForUuid extends Migration
{
    public function up()
    {
        Schema::table('personal_refresh_tokens', function (Blueprint $table) {
            $table->string('tokenable_id', 36)->change(); // Chuyển thành string(36)
        });
    }

    public function down()
    {
        Schema::table('personal_refresh_tokens', function (Blueprint $table) {
            $table->integer('tokenable_id')->change(); // Quay lại INTEGER nếu cần
        });
    }
}