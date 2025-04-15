<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChapterSeeder extends Seeder
{
    public function run()
    {
        $jsonPath = database_path('data/read_story_app.chapters.json');
        $jsonData = json_decode(file_get_contents($jsonPath), true);

        // Lấy storyId của Naruto
        $narutoStoryId = DB::table('stories')->where('title', 'Naruto')->value('storyId');

        if (!$narutoStoryId) {
            echo "Không tìm thấy truyện Naruto trong database.\n";
            return;
        }

        foreach ($jsonData as $item) {
            // Xử lý imageUrls thành array
            $imageUrls = $item['imageUrls'];

            if (is_string($imageUrls)) {
                // Nếu là string, tách bằng dấu phẩy và tạo thành array
                $imageUrls = array_map('trim', explode(',', $imageUrls));
            } elseif (!is_array($imageUrls)) {
                // Nếu không phải string hay array hợp lệ, chuyển thành array rỗng
                $imageUrls = [];
            }

            // Insert chương với storyId của Naruto
            DB::table('chapters')->insert([
                'chapterId' => Str::uuid()->toString(),
                'storyId' => $narutoStoryId, // Gán storyId của Naruto
                'chapterNumber' => $item['chapterNumber'],
                'title' => $item['title'],
                'imageUrls' => json_encode($imageUrls), // Lưu dưới dạng JSON
            ]);
        }
    }
}