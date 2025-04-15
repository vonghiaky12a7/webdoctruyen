<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;

class StoryListController extends Controller
{
    public function list(Request $request)
    {
        $query = Story::query();

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('genres')) {
            $genreIds = explode(',', $request->genres);
            $query->whereHas('genres', fn($q) => $q->whereIn('genres.genreId', $genreIds));
        }

        $sortBy = $request->sortBy ?? 'newest';
        $query->orderBy('releaseDate', $sortBy === 'oldest' ? 'asc' : 'desc');

        if ($request->has('limit')) {
            $query->limit($request->limit);
        }

        if ($request->isHome === 'true') {
            $query->orderBy('releaseDate', 'desc')->limit($request->limit ?? 12);
        }

        $stories = $query->get()->map(function ($story) {
            $chaptersCount = $story->chapters()->count();
            $ratings = $story->ratings()->get();
            $avgRating = $ratings->count() > 0 ? $ratings->avg('rating') : null;
            $genreIds = $story->genres()->pluck('genres.genreId')->toArray(); // Sửa ở đây

            return [
                'storyId' => $story->storyId,
                'title' => $story->title,
                'author' => $story->author,
                'description' => $story->description,
                'coverImage' => $story->coverImage,
                'genreIds' => $genreIds,
                'chapters' => $chaptersCount,
                'releaseDate' => $story->releaseDate,
                'rating' => $avgRating,
                'ratingCount' => $ratings->count(),
            ];
        });

        $sortedStories = match ($sortBy) {
            'oldest' => $stories->sortBy('releaseDate'),
            'rating' => $stories->sortByDesc('rating'),
            default => $stories->sortByDesc('releaseDate'),
        };

        if ($request->has('limit')) {
            $sortedStories = $sortedStories->take($request->limit);
        }

        return response()->json($sortedStories->values());
    }

    public function top(Request $request)
    {
        $limit = $request->limit ?? 7;
        $stories = Story::all()->map(function ($story) {
            $chaptersCount = $story->chapters()->count();
            $ratings = $story->ratings()->get();
            $avgRating = $ratings->count() > 0 ? $ratings->avg('rating') : 0;
            $genreIds = $story->genres()->pluck('genres.genreId')->toArray(); // Sửa ở đây

            return [
                'storyId' => $story->storyId,
                'title' => $story->title,
                'author' => $story->author,
                'description' => $story->description,
                'coverImage' => $story->coverImage,
                'genreIds' => $genreIds,
                'chapters' => $chaptersCount,
                'releaseDate' => $story->releaseDate,
                'rating' => $avgRating,
                'ratingCount' => $ratings->count(),
            ];
        });

        $result = $stories->sortByDesc('rating')->take($limit)->values();
        return response()->json($result);
    }
}
