<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTimestampsToPersonalRefreshTokensTable extends Migration
{
    public function up()
    {
        Schema::table('personal_refresh_tokens', function (Blueprint $table) {
            $table->timestamp('updated_at')->nullable(); // Thêm cột updated_at
        });
    }

    public function down()
    {
        Schema::table('personal_refresh_tokens', function (Blueprint $table) {
            $table->dropColumn('updated_at');
        });
    }
}
