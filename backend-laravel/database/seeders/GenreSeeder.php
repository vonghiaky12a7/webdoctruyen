<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('genres')->insert([
            ['genreName' => 'Lãng mạn'],
            ['genreName' => 'Siêu anh hùng'],
            ['genreName' => 'Kinh dị'],
            ['genreName' => 'Phiêu lưu'],
            ['genreName' => 'Hành động'],
            ['genreName' => 'Hài hước'],
            ['genreName' => 'Trinh thám'],
            ['genreName' => 'Phiêu lưu'],

        ]);
    }
}