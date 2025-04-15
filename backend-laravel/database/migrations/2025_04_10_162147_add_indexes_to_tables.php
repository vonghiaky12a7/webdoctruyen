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
        Schema::table('stories', function (Blueprint $table) {
            // $table->index('releaseDate'); // đã tồn tại
            // $table->index('author'); // đã tồn tại
            // $table->index('title'); // đã tồn tại
        });

        Schema::table('chapters', function (Blueprint $table) {
            // $table->index('storyId'); // đã tồn tại
            // $table->index('chapterNumber'); // đã tồn tại
        });

        Schema::table('ratings', function (Blueprint $table) {
            $table->index('storyId');
            $table->index('userId');
            $table->unique(['storyId', 'userId']);
        });

        Schema::table('favorites', function (Blueprint $table) {
            $table->index('userId');
            $table->index('storyId');
            $table->unique(['userId', 'storyId']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->index('storyId');
            $table->index('userId');
            $table->index('created_at');
        });

        Schema::table('story_genres', function (Blueprint $table) {
            $table->index('storyId');
            $table->index('genreId');
            $table->unique(['storyId', 'genreId']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            // $table->dropIndex(['releaseDate']); // đã tồn tại
            // $table->dropIndex(['author']); // đã tồn tại
            // $table->dropIndex(['title']); // đã tồn tại
        });

        Schema::table('chapters', function (Blueprint $table) {
            // $table->dropIndex(['storyId']); // đã tồn tại
            // $table->dropIndex(['chapterNumber']); // đã tồn tại
        });

        Schema::table('ratings', function (Blueprint $table) {
            $table->dropIndex(['storyId']);
            $table->dropIndex(['userId']);
            $table->dropUnique(['storyId', 'userId']);
        });

        Schema::table('favorites', function (Blueprint $table) {
            $table->dropIndex(['userId']);
            $table->dropIndex(['storyId']);
            $table->dropUnique(['userId', 'storyId']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropIndex(['storyId']);
            $table->dropIndex(['userId']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('story_genres', function (Blueprint $table) {
            $table->dropIndex(['storyId']);
            $table->dropIndex(['genreId']);
            $table->dropUnique(['storyId', 'genreId']);
        });
    }
};