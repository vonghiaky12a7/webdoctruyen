<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;

    protected $table = 'chapters';
    protected $primaryKey = 'chapterId';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'chapterId',
        'storyId',
        'chapterNumber',
        'title',
        'imageUrls'
    ];

    protected $casts = [
        'imageUrls' => 'array'
    ];

    public function story()
    {
        return $this->belongsTo(Story::class, 'storyId', 'storyId');
    }

    // Xử lý khi lấy giá trị của imageUrls từ database.
    public function getImageUrlsAttribute($value)
    {
        return json_decode($value, true) ?? [];
    }

    // Xử lý khi gán giá trị cho imageUrls trước khi lưu vào database.
    public function setImageUrlsAttribute($value)
    {
        // Nếu giá trị đã là chuỗi JSON, không cần json_encode lại
        if (is_string($value) && json_decode($value, true) !== null) {
            $this->attributes['imageUrls'] = $value;
        } else if (is_array($value)) {
            // Nếu là mảng, json_encode một lần
            $this->attributes['imageUrls'] = json_encode($value);
        } else {
            // Nếu không phải chuỗi JSON hay mảng, chuyển thành mảng rỗng
            $this->attributes['imageUrls'] = json_encode([]);
        }
    }
}
