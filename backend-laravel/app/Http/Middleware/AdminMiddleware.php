<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
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
        // Kiểm tra xem user đã được xác thực qua token chưa
        $user = $request->user(); // Sanctum gán user vào request nếu token hợp lệ

        if ($user && $user->roleId === 1) {
            return $next($request);
        }

        return response()->json(['message' => 'Bạn không có quyền'], 403);
    }
}