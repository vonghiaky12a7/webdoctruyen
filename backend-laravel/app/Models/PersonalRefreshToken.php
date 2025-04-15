<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalRefreshToken extends Model
{
    protected $fillable = ['tokenable_id', 'tokenable_type', 'token', 'expires_at', 'revoked_at'];

    public function tokenable()
    {
        return $this->morphTo();
    }

    public function isExpired()
    {
        return $this->expires_at && now()->greaterThan($this->expires_at);
    }

    public function isRevoked()
    {
        return !is_null($this->revoked_at);
    }
}