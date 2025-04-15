<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;

class StoryRatingController extends Controller
{
    public function getRatings($storyId)
    {
        $ratings = Rating::where('storyId', $storyId)->get();

        return response()->json([
            'ratings' => $ratings,
            'average' => $ratings->avg('rating'),
            'count' => $ratings->count()
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
            [
                'userId' => $validated['userId'],
                'storyId' => $validated['storyId'],
            ],
            [
                'rating' => $validated['rating'],
            ]
        );

        return response()->json([
            'message' => 'Đã thêm đánh giá mới',
            'rating' => $rating
        ]);
    }
}
