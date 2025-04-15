<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stories = [
            [
                'storyId' => Str::uuid()->toString(),
                'title' => 'Naruto',
                'author' => 'Masashi Kishimoto',
                'description' => 'Naruto là câu chuyện về Naruto Uzumaki, một ninja trẻ muốn tìm kiếm sự công nhận và ước mơ trở thành Hokage, ninja dẫn đầu làng.',
                'coverImage' => 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg',
                'releaseDate' => '1999-09-21',
            ],
            [
                'storyId' => Str::uuid()->toString(),
                'title' => 'One Piece',
                'author' => 'Eiichiro Oda',
                'description' => 'One Piece là câu chuyện về Monkey D. Luffy, người đã vô tình ăn phải trái ác quỷ Gomu Gomu, biến cơ thể cậu thành cao su và giờ cậu cùng các đồng đội hải tặc của mình đang trên hành trình tìm kiếm kho báu vĩ đại nhất thế giới One Piece.',
                'coverImage' => 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg',
                'releaseDate' => '1997-07-22',
            ],
            [
                'storyId' => Str::uuid()->toString(),
                'title' => 'Dragon Ball',
                'author' => 'Akira Toriyama',
                'description' => 'Dragon Ball kể về cuộc phiêu lưu của Son Goku từ thời thơ ấu cho đến khi trưởng thành cùng với những người bạn của mình.',
                'coverImage' => 'https://upload.wikimedia.org/wikipedia/en/c/c9/DB_Tank%C5%8Dbon.png',
                'releaseDate' => '1984-11-20',
            ],
            [
                'storyId' => Str::uuid()->toString(),
                'title' => 'Attack on Titan',
                'author' => 'Hajime Isayama',
                'description' => 'Attack on Titan là câu chuyện về nhân loại đứng trên bờ vực tuyệt chủng khi những sinh vật khổng lồ gọi là Titan xuất hiện và ăn thịt con người.',
                'coverImage' => 'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_volume_1.jpg',
                'releaseDate' => '2009-09-09',
            ],
            [
                'storyId' => Str::uuid()->toString(),
                'title' => 'Demon Slayer',
                'author' => 'Koyoharu Gotouge',
                'description' => 'Demon Slayer kể về hành trình của Tanjiro Kamado, người tìm cách chữa trị cho em gái của mình, Nezuko, sau khi cô bị biến thành quỷ và anh trở thành một thợ săn quỷ để tiêu diệt chúng.',
                'coverImage' => 'https://upload.wikimedia.org/wikipedia/en/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg',
                'releaseDate' => '2016-02-15',
            ],
            [
                'storyId' => Str::uuid()->toString(),
                'title' => 'Bleach',
                'author' => 'Tite Kubo',
                'description' => 'Bleach kể về hành trình của Kurosaki Ichigo, một thiếu niên có khả năng nhìn thấy linh hồn...',
                'coverImage' => 'https://res.cloudinary.com/luto-manga/image/upload/v1742372889/listmanga/Bleach/background/cover.png',
                'releaseDate' => '2025-03-19',
            ],
        ];

        foreach ($stories as $story) {
            DB::table('stories')->insert([
                'storyId' => $story['storyId'],
                'title' => $story['title'],
                'author' => $story['author'],
                'description' => $story['description'],
                'coverImage' => $story['coverImage'],
                'releaseDate' => Carbon::parse($story['releaseDate']),
            ]);
        }
    }
}
