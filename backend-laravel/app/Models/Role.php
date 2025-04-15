<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Role extends Model
{
    // Tên bảng trong database
    protected $table = 'roles';
    public $timestamps = false; // Tắt timestamps
    // Các cột có thể gán giá trị (mass assignable)
    protected $fillable = [
        'roleId',
        'roleName',
    ];

    // Tắt tự động tăng cho khóa chính (nếu không dùng cột id làm khóa chính)
    public $incrementing = true;

    // Khóa chính mặc định là 'id', nếu muốn đổi thành 'roleId', uncomment dòng dưới
    protected $primaryKey = 'roleId';

    // Kiểu dữ liệu của khóa chính (nếu dùng roleId)
    protected $keyType = 'int';
}
