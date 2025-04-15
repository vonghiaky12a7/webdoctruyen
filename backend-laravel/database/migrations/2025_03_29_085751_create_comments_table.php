<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('userId');
            $table->uuid('storyId');
            $table->text('content');
            $table->timestamps();

            // Foreign keys
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('storyId')->references('storyId')->on('stories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
