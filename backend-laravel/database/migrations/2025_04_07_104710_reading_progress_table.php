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
        Schema::create('reading_progress', function (Blueprint $table) {
            $table->id();
            $table->uuid('userId');
            $table->uuid('storyId');
            $table->uuid('lastChapterId')->nullable();
            $table->integer('lastPage')->default(0);
            $table->timestamp('lastReadAt')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('storyId')->references('storyId')->on('stories')->onDelete('cascade');
            $table->foreign('lastChapterId')->references('chapterId')->on('chapters')->onDelete('set null');

            // Unique constraint để đảm bảo mỗi user chỉ có một tiến trình cho mỗi story
            $table->unique(['userId', 'storyId']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reading_progress');
    }
};
