<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            ['roleId' => 1, 'roleName' => 'Admin'],
            ['roleId' => 2, 'roleName' => 'Writer'],
            ['roleId' => 3, 'roleName' => 'Reader'], // Đảm bảo roleId 3 tồn tại
        ]);
    }
}
