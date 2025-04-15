<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redis;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/redis-keys', function () {
    try {
        $redis = Redis::connection('cache');
        $keys = $redis->keys('*');

        if (empty($keys)) {
            return response()->json(['message' => 'No keys found in Redis'], 200);
        }

        return response()->json(['keys' => $keys], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
