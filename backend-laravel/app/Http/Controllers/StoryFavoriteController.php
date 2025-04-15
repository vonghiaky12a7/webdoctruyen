<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class StoryFavoriteController extends Controller
{
    public function addToFavorites(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'storyId' => 'required|string|exists:stories,storyId',
        ]);

        $favorite = Favorite::firstOrCreate([
            'userId' => $validated['userId'],
            'storyId' => $validated['storyId'],
        ]);

        return response()->json([
            'message' => 'Đã thêm truyện vào danh sách yêu thích',
            'favorite' => $favorite
        ]);
    }

    public function removeFromFavorites(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'storyId' => 'required|string',
        ]);

        $deleted = Favorite::where('userId', $validated['userId'])
            ->where('storyId', $validated['storyId'])
            ->delete();

        return response()->json([
            'message' => 'Đã xóa truyện khỏi danh sách yêu thích',
            'success' => $deleted > 0
        ]);
    }

    public function getFavorites($userId)
    {
        $favorites = Favorite::where('userId', $userId)
            ->join('stories', 'favorites.storyId', '=', 'stories.storyId')
            ->select('stories.*', 'favorites.created_at as favorited_at')
            ->get();

        return response()->json([
            'favorites' => $favorites
        ]);
    }
    public function checkFavoriteStatus(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'storyId' => 'required|string',
        ]);

        $exists = Favorite::where('userId', $validated['userId'])
            ->where('storyId', $validated['storyId'])
            ->exists();

        return response()->json(['isFavorite' => $exists]);
    }
}
