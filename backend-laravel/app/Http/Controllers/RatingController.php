<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function getRatings($storyId)
    {
        $ratings = Rating::where('storyId', $storyId)->get();
        return response()->json([
            'ratings' => $ratings,
            'average' => $ratings->avg('rating'),
            'count' => $ratings->count(),
        ]);
    }
    /**
     * Xóa đánh giá theo ID
     */
    public function destroyById($ratingId)
    {
        $rating = Rating::findOrFail($ratingId);
        $rating->delete();

        return response()->json(['message' => 'Đã xóa đánh giá thành công']);
    }

    /**
     * Lấy danh sách đánh giá của một người dùng
     */
    public function getUserRatings($userId)
    {
        $ratings = Rating::where('userId', $userId)
            ->with('story:id,title') // Lấy thông tin cơ bản của truyện
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'ratings' => $ratings,
            'total' => $ratings->count(),
        ]);
    }

    public function addRating(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'storyId' => 'required|string|exists:stories,storyId',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $rating = Rating::updateOrCreate(
            ['userId' => $validated['userId'], 'storyId' => $validated['storyId']],
            ['rating' => $validated['rating']]
        );

        return response()->json(['message' => 'Đã thêm đánh giá mới', 'rating' => $rating]);
    }
}
