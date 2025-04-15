<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AttachTokenFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Lấy token từ cookie 'auth_token'
        $token = $request->cookie('access_token');

        if ($token) {
            // Gắn token vào header Authorization dưới dạng Bearer Token
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
