<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Võ Nghĩa Kỳ',
                'email' => 'vonghiaky12a7@gmail.com',
                'password' => Hash::make('Nghiaky1411'),
                'avatarPath' => 'https://lh3.googleusercontent.com/a/ACg8ocLjUm2oqRrpbvoNunyoWQlUSUDPiUAbDFLRXIIW6mveQbQ8hjk',
                'google_id' => '106215876455982452958',
                'roleId' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Phạm Quốc Cường',
                'email' => 'phamquoccuong.pqc.job@gmail.com',
                'password' => '770c87da6410718786459828fd4c6736ec78844920bc018e3919b6d58d72b21f',
                'avatarPath' => 'https://res.cloudinary.com/luto-manga/image/upload/v1741769648/uzearumvkdfzhthty8te.jpg',
                'google_id' => null,
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Admin',
                'email' => 'richard.dataprotection@gmail.com',
                'password' => '$2b$12$Ryzgc422rWEnbptg.JY4WOHNCC3mSWAMp5nLOJw76xbOgVmQbVb.O',
                'avatarPath' => 'https://th.bing.com/th/id/OIP.hIWnBO3sop9nHiu1GQzNrAHaHa?rs=1&pid=ImgDetMain',
                'google_id' => null,
                'roleId' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Phan Trọng Huy',
                'email' => 'pthuy200307@gmail.com',
                'password' => '$2b$12$ol1uW/1tq4h/PJEviG7LnufcetSDw1J56FG/iIiiTnKi.0DXV2WVC',
                'avatarPath' => 'https://th.bing.com/th/id/OIP.hIWnBO3sop9nHiu1GQzNrAHaHa?rs=1&pid=ImgDetMain',
                'google_id' => null,
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'FE Credit',
                'email' => 'fecredit09@gmail.com',
                'password' => '$2b$10$7NELaS4knBOYWbgDVASwR.EhQWv9Pv7BXsT9ZcT758wBV29nkWK3C',
                'avatarPath' => 'https://lh3.googleusercontent.com/a/ACg8ocKoOGAKpNewnjWICMPCZoPVDMtFjLgtAQ8AdRcFLPjA2Q3c2Q=s96-c',
                'google_id' => '104599992902102384489',
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Ky Vo',
                'email' => 'vonghiaky14112003@gmail.com',
                'password' => '$2b$12$R2BWYg4gFG.ic72EXGRZ8eXaj8c4xKegf2GQVsw0ZZRYx30hjextm',
                'avatarPath' => 'https://lh3.googleusercontent.com/a/ACg8ocKYtt8LheLAfVJiFayCN0l7qAKeFynt9SWLzm1q6_IVXDcV3Q=s96-c',
                'google_id' => '105985833510255823283',
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Kỳ 0740_Võ Nghĩa',
                'email' => 'vonghiaky2003@gmail.com',
                'password' => '$2b$12$KKaXBgBGnaJdRiGheZYAHe3zPaKnBahk75Eonsa2aLWl2kr4UcDoO',
                'avatarPath' => 'https://lh3.googleusercontent.com/a/ACg8ocIDjK4cNRUrA3JFORuI-iebvwK1-WLvBKzW6PeZ71wAuGUi7ao=s96-c',
                'google_id' => '102533470983087479658',
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => '7340_ Phạm Quốc Cường',
                'email' => 'khoaaccai@gmail.com',
                'password' => '$2b$12$WElzLvkZPptysBekT.vx1.nKWYhRQ37ECcYB.hAAqvhKLFumDL9Qe',
                'avatarPath' => 'https://lh3.googleusercontent.com/a/ACg8ocJoS6l3xMm7wA5m-kM83BTehZ20E4TnZkwXAFFOO7BgnvZwyK0J=s96-c',
                'google_id' => '116932588952034908641',
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'Phan Trọng Hiếu',
                'email' => 'pthieu1409@gmail.com',
                'password' => '$2b$12$9viJlOGI/mkdNXBETRJN9ujpu/MXZ/R610pwRzo3vWr5F4KV6z9Nq',
                'avatarPath' => 'https://th.bing.com/th/id/OIP.hIWnBO3sop9nHiu1GQzNrAHaHa?rs=1&pid=ImgDetMain',
                'google_id' => null,
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'username' => 'trong Huy',
                'email' => 'pthuy203@gmail.com',
                'password' => '$2b$12$3H8FAcwPH8dUilKzudyVrOEa.3kgSPomwvixw6ccME2I988BPb3Te',
                'avatarPath' => 'https://th.bing.com/th/id/OIP.hIWnBO3sop9nHiu1GQzNrAHaHa?rs=1&pid=ImgDetMain',
                'google_id' => null,
                'roleId' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}