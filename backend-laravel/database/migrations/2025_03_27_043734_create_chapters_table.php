<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChaptersTable extends Migration
{
    public function up()
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->uuid('chapterId')->primary();
            $table->uuid('storyId');
            $table->integer('chapterNumber');
            $table->string('title');
            $table->json('imageUrls');

            // Foreign key
            $table->foreign('storyId')->references('storyId')->on('stories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('chapters');
    }
}
