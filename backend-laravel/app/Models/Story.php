<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use App\Models\Chapter;
use App\Models\Genre;
use App\Models\Rating;

class Story extends Model
{
    use HasFactory;
    
    protected $table = 'stories'; // Tên bảng
    protected $primaryKey = 'storyId'; // Khóa chính
    public $incrementing = false; // Khóa chính không tự tăng
    protected $keyType = 'string'; // Kiểu dữ liệu của khóa chính
    public $timestamps = false; // Không sử dụng timestamps

    protected $fillable = [
        'storyId',
        'title',
        'author',
        'description',
        'coverImage',
        'releaseDate',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->storyId)) {
                $model->storyId = Str::uuid()->toString();
            }
        });
    }

    // Quan hệ nhiều-nhiều với Genre
    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'story_genres', 'storyId', 'genreId');
    }

    // Quan hệ một-nhiều với Chapter
    public function chapters()
    {
        return $this->hasMany(Chapter::class, 'storyId', 'storyId');
    }

    // Quan hệ một-nhiều với Rating
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'storyId', 'storyId');
    }
}