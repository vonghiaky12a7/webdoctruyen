<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FavoriteSeeder extends Seeder
{
    public function run()
    {
        // Lấy danh sách userId và storyId từ bảng ratings
        $userIds = array_values(DB::table('ratings')->pluck('userId')->unique()->toArray());
        $storyIds = array_values(DB::table('ratings')->pluck('storyId')->unique()->toArray());

        // Kiểm tra nếu không có dữ liệu thì dừng
        if (empty($userIds) || empty($storyIds)) {
            return;
        }

        // Số lượng mục yêu thích muốn tạo
        $count = min(5, count($userIds), count($storyIds)); // Tránh lỗi nếu số lượng dữ liệu quá ít

        $favorites = [];
        for ($i = 0; $i < $count; $i++) {
            $favorites[] = [
                'id' => Str::uuid()->toString(),
                'userId' => $userIds[$i],  // Chọn theo index cố định
                'storyId' => $storyIds[$i], // Chọn theo index cố định
            ];
        }

        // Chèn dữ liệu vào bảng favorites
        DB::table('favorites')->insert($favorites);
    }
}