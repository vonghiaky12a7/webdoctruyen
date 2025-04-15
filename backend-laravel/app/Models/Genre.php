<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Genre extends Model
{
    protected $table = 'genres'; // Tên bảng

    protected $primaryKey = 'genreId'; // Khóa chính

    public $timestamps = false; // Sử dụng timestamps

    public $incrementing = true;

    protected $fillable = [
        'genreId',
        'genreName',
    ];

    // Quan hệ nhiều-nhiều với Story
    public function stories(): BelongsToMany
    {
        return $this->belongsToMany(Story::class, 'story_genres', 'genreId', 'storyId');
    }

}
