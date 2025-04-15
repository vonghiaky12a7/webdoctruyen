<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonalRefreshTokensTable extends Migration
{
    public function up()
    {
        Schema::create('personal_refresh_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable'); // Liên kết với user hoặc model khác
            $table->string('token', 64)->unique(); // Refresh token dạng hash
            $table->timestamp('expires_at'); // Thời gian hết hạn
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('revoked_at')->nullable(); // Thời gian thu hồi (nếu có)
        });
    }

    public function down()
    {
        Schema::dropIfExists('personal_refresh_tokens');
    }
}
