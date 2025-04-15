<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // Kiểm tra xem truyện có trong danh sách yêu thích không
    public function checkFavorite(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string|exists:users,id',
            'storyId' => 'required|string',
        ]);

        $storyExists = Story::where('storyId', $validated['storyId'])->exists();
        if (!$storyExists) {
            return response()->json(['isFavorited' => false], 200);
        }

        $exists = Favorite::where('userId', $validated['userId'])
            ->where('storyId', $validated['storyId'])
            ->exists();

        return response()->json(['isFavorited' => $exists]);
    }

    // Thêm truyện vào danh sách yêu thích
    public function addToFavorites(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string|exists:users,id',
            'storyId' => 'required|string|exists:stories,storyId',
        ]);

        $favorite = Favorite::firstOrCreate($validated);
        return response()->json([
            'message' => 'Đã thêm truyện vào danh sách yêu thích',
            'favorite' => $favorite
        ]);
    }

    // Xóa truyện khỏi danh sách yêu thích
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'storyId' => 'required|string|exists:stories,storyId',
        ]);

        $deleted = Favorite::where('userId', $validated['userId'])
            ->where('storyId', $validated['storyId'])
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Đã xóa truyện khỏi danh sách yêu thích', 'success' => true]);
        }

        return response()->json(['message' => 'Không tìm thấy truyện trong danh sách yêu thích', 'success' => false], 404);
    }
}
