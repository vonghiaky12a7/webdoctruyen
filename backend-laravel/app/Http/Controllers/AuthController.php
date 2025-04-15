<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;
use App\Models\PersonalRefreshToken;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    // Đăng ký người dùng
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();

            if ($errors->has('email')) {
                return response()->json(['message' => 'Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.'], 422);
            }

            if ($errors->has('username')) {
                return response()->json(['message' => 'Tên người dùng đã được sử dụng. Vui lòng chọn tên khác.'], 422);
            }

            return response()->json(['message' => 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'], 422);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
        ], 201);
    }

    // Đăng nhập (trả về cả AT và RT)
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'field' => 'email',
                'message' => 'Email không tồn tại trong hệ thống',
            ], 404);
        }

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'field' => 'password',
                'message' => 'Mật khẩu không chính xác',
            ], 401);
        }

        $user = Auth::user();

        // Xóa các token cũ
        $user->tokens()->delete();
        PersonalRefreshToken::where('tokenable_id', $user->id)
            ->where('tokenable_type', User::class)
            ->delete();

        // Tạo Access Token (15 phút)
        $accessToken = $user->createToken('access_token', ['*'], now()->addMinutes(15))->plainTextToken;

        // Tạo Refresh Token (7 ngày)
        $refreshToken = Str::random(64);
        PersonalRefreshToken::create([
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
            'token' => $refreshToken,
            'expires_at' => now()->addDays(7),
        ]);

        $expiresAt = now()->addMinutes(15)->timestamp * 1000; // Timestamp (ms) cho client

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
        ])->cookie('access_token', $accessToken, 15)
            ->cookie('refresh_token', $refreshToken, 60 * 24 * 7)
            ->cookie('expires_at', $expiresAt, 15, null, null, false, false) // HttpOnly = false
            ->cookie('role_id', $user->roleId, 15, null, null, false, false); // HttpOnly = false
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            PersonalRefreshToken::where('tokenable_id', $request->user()->id)
                ->where('tokenable_type', User::class)
                ->update(['revoked_at' => now()]);

            return response()->json([
                'message' => 'Đăng xuất thành công',
            ], 200)->withoutCookie('access_token')
                ->withoutCookie('refresh_token')
                ->withoutCookie('expires_at')
                ->withoutCookie('role_id');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy thông tin người dùng
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json($user, 200);
    }

    // Refresh Access Token
    public function refreshToken(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token') ?? $request->input('refresh_token');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token không được cung cấp'], 401);
        }

        $rt = PersonalRefreshToken::where('token', $refreshToken)->first();

        if (!$rt || $rt->isExpired() || $rt->isRevoked()) {
            return response()->json(['message' => 'Refresh token không hợp lệ hoặc đã hết hạn'], 401)
                ->withoutCookie('access_token')
                ->withoutCookie('expires_at')
                ->withoutCookie('role_id');
        }

        $user = $rt->tokenable;

        // Xóa AT cũ
        $user->tokens()->delete();

        // Tạo AT mới (15 phút)
        $newAccessToken = $user->createToken('access_token', ['*'], now()->addMinutes(15))->plainTextToken;
        $expiresAt = now()->addMinutes(15)->timestamp * 1000; // Timestamp (ms) cho client

        return response()->json([

            'message' => 'Refresh token thành công',
            'user' => $user,
            'expires_in' => 900, // 15 phút tính bằng giây
        ])->cookie('access_token', $newAccessToken, 15, null, null, false, true) // HttpOnly = true
            ->cookie('expires_at', $expiresAt, 15, null, null, false, false) // HttpOnly = false để client đọc được
            ->cookie('role_id', $user->roleId, 15, null, null, false, false); // HttpOnly = false
    }


    // Gửi email reset password>>>>>>> kyvo
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) {
                try {
                    $resetUrl = "http://localhost:3000/auth/reset-password?token={$token}&email=" . urlencode($user->email);
                    Mail::to($user->email)->send(new ResetPasswordMail($resetUrl));
                } catch (\Exception $e) {
                    \Log::error("Failed to send reset email: " . $e->getMessage());
                    throw $e;
                }
            }
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Email sent!'], 200)
            : response()->json(['message' => 'Unable to send email', 'error' => $status], 400);
    }

    // Reset password
    public function resetPassword(Request $request)
    {

        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        \Log::info("Reset request - Email: {$request->email}, Token: {$request->token}");
        return $status === Password::PASSWORD_RESET
            ? response()->json(['status' => __($status)], 200)
            : response()->json(['error' => __($status)], 400);
    }

    public function googleRedirect(Request $request)
    {
        // Thiết lập lại scope cho Google
        $redirectUrl = Socialite::driver('google')
            ->stateless()
            ->setScopes(['email', 'profile']) // Thay đổi danh sách scope
            ->redirect()
            ->getTargetUrl();

        return response()->json([
            'message' => 'Redirect to Google login',
            'redirect_url' => $redirectUrl,
        ], 200);
    }


    /**
     * Xử lý callback từ Google
     */
    public function googleCallback(Request $request)
    {
        \Log::info('googleCallback called with request type: ' . $request->method());
        try {
            // Lấy code từ query string
            $code = $request->query('code');
            if (!$code) {
                throw new \Exception('Code không được cung cấp trong query string.');
            }

            // Lấy thông tin người dùng từ Google
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            // Tìm hoặc tạo người dùng trong database
            $user = User::updateOrCreate(
                [
                    'google_id' => $googleUser->id,
                ],
                [
                    'username' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatarPath' => $googleUser->avatar, // Lưu URL avatar từ Google
                    'password' => Hash::make(Str::random(16)), // Tạo mật khẩu ngẫu nhiên
                ]
            );

            // Xóa các token cũ
            $user->tokens()->delete();
            PersonalRefreshToken::where('tokenable_id', $user->id)
                ->where('tokenable_type', User::class)
                ->delete();

            // Tạo Access Token (15 phút)
            $accessToken = $user->createToken('access_token', ['*'], now()->addMinutes(15))->plainTextToken;

            // Tạo Refresh Token (7 ngày)
            $refreshToken = Str::random(64);
            PersonalRefreshToken::create([
                'tokenable_id' => $user->id,
                'tokenable_type' => User::class,
                'token' => $refreshToken,
                'expires_at' => now()->addDays(7),
            ]);

            $expiresAt = now()->addMinutes(15)->timestamp * 1000; // Timestamp (ms) cho client

            return response()->json([
                'message' => 'Đăng nhập bằng Google thành công!',
                'user' => $user,
            ])->cookie('access_token', $accessToken, 15)
                ->cookie('refresh_token', $refreshToken, 60 * 24 * 7)
                ->cookie('expires_at', $expiresAt, 15, null, null, false, false) // HttpOnly = false
                ->cookie('role_id', $user->roleId, 15, null, null, false, false); // HttpOnly = false
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đăng nhập bằng Google thất bại.',
                'error' => $e->getMessage(),
            ], 401);
        }
    }
}