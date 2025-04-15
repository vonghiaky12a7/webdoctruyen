<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommentSeeder extends Seeder
{
    public function run()
    {
        // Lấy danh sách storyId từ bảng stories
        $storyIds = DB::table('stories')->pluck('storyId')->toArray();

        // Lấy danh sách userId từ bảng users
        $userIds = DB::table('users')->pluck('id')->toArray();

        // Danh sách nội dung bình luận mẫu
        $commentContents = [
            'Truyện rất hay, tôi rất thích nhân vật chính!',
            'Cốt truyện hấp dẫn, mong chờ chapter tiếp theo.',
            'Hình ảnh đẹp, nhưng cốt truyện hơi chậm.',
            'Tuyệt vời! Một trong những truyện hay nhất mà tôi từng đọc.',
            'Nhân vật phụ rất thú vị, hy vọng sẽ có nhiều phát triển hơn về họ.',
            'Tôi thích cách tác giả xây dựng thế giới trong truyện này.',
            'Không thể đợi đến chapter tiếp theo!',
            'Truyện này đáng đọc, khuyên mọi người nên thử.',
            'Tình tiết hơi khó hiểu, nhưng vẫn rất cuốn.',
            'Tôi đã đọc truyện này 3 lần và vẫn thấy thú vị.'
        ];

        // Tạo comments ngẫu nhiên
        foreach ($storyIds as $storyId) {
            // Mỗi truyện có 5-10 bình luận
            $commentCount = rand(5, 10);

            for ($i = 0; $i < $commentCount; $i++) {
                DB::table('comments')->insert([
                    'id' => Str::uuid()->toString(),
                    'userId' => $userIds[array_rand($userIds)],
                    'storyId' => $storyId,
                    'content' => $commentContents[array_rand($commentContents)],
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
