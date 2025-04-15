<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadingProgress extends Model
{
    protected $table = 'reading_progress'; // Tên bảng
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'userId',
        'storyId',
        'lastChapterId',
        'lastPage',
        'lastReadAt'
    ];

    /**
     * Quan hệ với User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }

    /**
     * Quan hệ với Story
     */
    public function story()
    {
        return $this->belongsTo(Story::class, 'storyId', 'storyId');
    }

    /**
     * Quan hệ với Chapter
     */
    public function chapter()
    {
        return $this->belongsTo(Chapter::class, 'lastChapterId', 'chapterId');
    }
}