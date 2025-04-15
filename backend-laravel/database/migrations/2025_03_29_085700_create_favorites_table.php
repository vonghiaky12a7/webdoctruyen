<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    public function up()
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('userId');
            $table->uuid('storyId');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('storyId')->references('storyId')->on('stories')->onDelete('cascade');

            // Unique constraint
            $table->unique(['userId', 'storyId']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('favorites');
    }
}
