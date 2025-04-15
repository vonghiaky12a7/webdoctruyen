<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenreStorySeeder extends Seeder
{
    public function run()
    {
        // Lấy danh sách storyId từ bảng stories
        $stories = DB::table('stories')->pluck('storyId', 'title')->toArray();

        $genreStoryData = [
            ['title' => 'Attack on Titan', 'genreIds' => [6, 1, 4]],
            ['title' => 'Naruto', 'genreIds' => [2, 4]],
            ['title' => 'Demon Slayer', 'genreIds' => [5, 1]],
            ['title' => 'One Piece', 'genreIds' => [1, 5]],
            ['title' => 'Dragon Ball', 'genreIds' => [1, 2]],
            ['title' => 'Bleach', 'genreIds' => [1, 2]],
        ];

        foreach ($genreStoryData as $data) {
            $storyId = $stories[$data['title']] ?? null;
            if (!$storyId) {
                echo "⚠️ Không tìm thấy storyId cho: " . $data['title'] . "\n";
                continue; // Bỏ qua nếu không tìm thấy
            }

            foreach ($data['genreIds'] as $genreId) {
                DB::table('story_genres')->insert([
                    'storyId' => $storyId,
                    'genreId' => $genreId,
                ]);
            }
        }
    }
}
