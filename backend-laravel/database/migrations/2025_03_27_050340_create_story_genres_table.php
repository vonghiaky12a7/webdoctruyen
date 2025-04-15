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
        Schema::create('story_genres', function (Blueprint $table) {
            $table->id();
            $table->string('storyId'); // Phải là string để khớp với stories
            $table->unsignedBigInteger('genreId'); // Đảm bảo kiểu dữ liệu khớp với bảng genres

            $table->foreign('storyId')->references('storyId')->on('stories')->onDelete('cascade');
            $table->foreign('genreId')->references('genreId')->on('genres')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('genre_story');
    }
};
