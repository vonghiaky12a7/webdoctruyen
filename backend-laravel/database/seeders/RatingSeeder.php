<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy danh sách userId và storyId từ cơ sở dữ liệu
        $userIds = DB::table('users')->pluck('id')->toArray();
        $storyIds = DB::table('stories')->pluck('storyId')->toArray();

        // Kiểm tra xem có userId và storyId hay không
        if (empty($userIds) || empty($storyIds)) {
            echo "Không tìm thấy user hoặc story trong cơ sở dữ liệu.\n";
            return;
        }

        $ratings = [];
        $generatedCount = 0;
        $maxAttempts = 1000; // Giới hạn số lần thử
        $existingPairs = []; // Lưu các cặp userId-storyId đã sử dụng

        // Tạo 100 bản ghi đánh giá
        while ($generatedCount < 100 && $maxAttempts > 0) {
            $userId = $userIds[array_rand($userIds)];
            $storyId = $storyIds[array_rand($storyIds)];
            $pairKey = "{$userId}-{$storyId}";

            // Kiểm tra trùng lặp trong mảng tạm
            if (!in_array($pairKey, $existingPairs)) {
                // Kiểm tra trùng lặp trong database
                $exists = DB::table('ratings')
                    ->where('userId', $userId)
                    ->where('storyId', $storyId)
                    ->exists();

                if (!$exists) {
                    $ratings[] = [
                        'id' => Str::uuid()->toString(),
                        'userId' => $userId,
                        'storyId' => $storyId,
                        'rating' => rand(1, 5), // Random từ 1 đến 5
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                    $existingPairs[] = $pairKey;
                    $generatedCount++;
                }
            }

            $maxAttempts--;
        }

        // Kiểm tra nếu không đủ 100 bản ghi
        if ($generatedCount < 100) {
            echo "Chỉ tạo được {$generatedCount} bản ghi do giới hạn user/story hoặc trùng lặp.\n";
        }

        // Chèn tất cả bản ghi vào bảng ratings
        try {
            if (!empty($ratings)) {
                DB::table('ratings')->insert($ratings);
                echo "Đã chèn {$generatedCount} bản ghi đánh giá.\n";
            }
        } catch (\Illuminate\Database\QueryException $e) {
            echo "Lỗi khi chèn bản ghi: " . $e->getMessage() . "\n";
        }

        // Xóa cache để đảm bảo dữ liệu mới được phản ánh
        \Illuminate\Support\Facades\Cache::flush();
        echo "Đã xóa cache.\n";
    }
}
