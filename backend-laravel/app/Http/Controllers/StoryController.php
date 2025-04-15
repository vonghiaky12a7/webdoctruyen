<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\Chapter;
use App\Models\Rating;
use App\Models\Favorite;
use App\Models\Comment;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class StoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 20); // Mặc định 20 bản ghi mỗi trang
        $cacheKey = "stories_index_{$perPage}";

        $stories = Cache::remember($cacheKey, 86400, function () use ($perPage) {
            return Story::select('storyId', 'title', 'author', 'coverImage', 'releaseDate')
                ->withCount(['chapters', 'ratings'])
                ->withAvg('ratings', 'rating')
                ->with('genres:genres.genreId')
                ->orderBy('releaseDate', 'desc')
                ->paginate($perPage)
                ->through(function ($story) {
                    return [
                        'storyId' => $story->storyId,
                        'title' => $story->title,
                        'author' => $story->author,
                        'coverImage' => $story->coverImage,
                        'genreIds' => $story->genres->pluck('genreId')->toArray(),
                        'chapters' => $story->chapters_count,
                        'releaseDate' => $story->releaseDate,
                        'rating' => $story->ratings_avg_rating ? round($story->ratings_avg_rating, 1) : null,
                        'ratingCount' => $story->ratings_count ?? 0,
                    ];
                });
        });

        return response()->json([
            'data' => $stories->items(),
            'pagination' => [
                'current_page' => $stories->currentPage(),
                'total_pages' => $stories->lastPage(),
                'total_items' => $stories->total(),
                'per_page' => $stories->perPage(),
            ]
        ]);
    }

    public function show($storyId)
    {
        $cacheKey = "story_{$storyId}";

        $story = Cache::remember($cacheKey, 600, function () use ($storyId) {
            return Story::select('storyId', 'title', 'author', 'description', 'coverImage', 'releaseDate')
                ->withCount('chapters')
                ->withAvg('ratings', 'rating')
                ->with('genres:genres.genreId,genres.genreName') // Lấy cả genreId và genreName
                ->where('storyId', $storyId)
                ->firstOrFail();
        });

        return response()->json([
            'storyId' => $story->storyId,
            'title' => $story->title,
            'author' => $story->author,
            'description' => $story->description,
            'coverImage' => $story->coverImage,
            'genres' => $story->genres->map(function ($genre) {
                return [
                    'genreId' => $genre->genreId,
                    'genreName' => $genre->genreName,
                ];
            })->toArray(), // Trả về mảng chứa cả genreId và genreName
            'chapters' => $story->chapters_count,
            'releaseDate' => $story->releaseDate,
            'rating' => $story->ratings_avg_rating ? round($story->ratings_avg_rating, 1) : null,
            'ratingCount' => $story->ratings_count ?? 0,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'description' => 'required|string',
            'coverImage' => 'required|string',
            'genreIds' => 'required|array',
            'genreIds.*' => 'integer|exists:genres,genreId',
            'releaseDate' => 'required|date',
        ]);

        $story = Story::create([
            'storyId' => Str::uuid()->toString(),
            'title' => $request->title,
            'author' => $request->author,
            'description' => $request->description,
            'coverImage' => $request->coverImage,
            'releaseDate' => $request->releaseDate,
        ]);

        $story->genres()->attach($request->genreIds);

        Cache::forget("stories_index_20");
        Cache::forget("stories_list");

        return response()->json([
            'message' => 'Story created successfully',
            'storyId' => $story->storyId
        ], 201);
    }

    public function update(Request $request, $storyId)
    {
        $story = Story::where('storyId', $storyId)->firstOrFail();

        $request->validate([
            'title' => 'string',
            'author' => 'string',
            'description' => 'string',
            'coverImage' => 'string',
            'genreIds' => 'array',
            'genreIds.*' => 'integer|exists:genres,genreId',
            'releaseDate' => 'date',
        ]);

        $story->update($request->only(['title', 'author', 'description', 'coverImage', 'releaseDate']));

        if ($request->has('genreIds')) {
            $story->genres()->sync($request->genreIds);
        }

        Cache::forget("story_{$storyId}");
        Cache::forget("stories_index_20");
        Cache::forget("stories_list");

        return response()->json(['message' => 'Story updated successfully']);
    }

    public function destroy($storyId)
    {
        $story = Story::where('storyId', $storyId)->firstOrFail();
        $story->genres()->detach();
        $story->delete();

        Cache::forget("story_{$storyId}");
        Cache::forget("stories_index_20");
        Cache::forget("stories_list");

        return response()->json(['message' => 'Story deleted successfully']);
    }

    public function list(Request $request)
    {
        $perPage = $request->input('limit', 8); // Mặc định 8 bản ghi mỗi trang
        $sortBy = $request->input('sortBy', 'newest');
        $cacheKey = "stories_list_{$sortBy}_{$perPage}" . md5(json_encode($request->except(['limit', 'sortBy'])));

        $stories = Cache::remember($cacheKey, 600, function () use ($request, $perPage, $sortBy) {
            $query = Story::select('storyId', 'title', 'author', 'coverImage', 'releaseDate')
                ->withCount('chapters')
                ->withCount('ratings') // Đếm số lượng bản ghi trong bảng ratings
                ->withAvg('ratings', 'rating')
                ->with('genres:genres.genreId,genres.genreName');

            if ($request->has('title')) {
                $query->where('title', 'like', '%' . $request->title . '%');
            }

            if ($request->has('genres')) {
                $genreIds = explode(',', $request->genres);
                $query->whereHas('genres', fn($q) => $q->whereIn('genres.genreId', $genreIds));
            }

            match ($sortBy) {
                'oldest' => $query->orderBy('releaseDate', 'asc'),
                'rating' => $query->whereHas('ratings')->orderByDesc('ratings_avg_rating'),
                'newest' => $query->orderBy('releaseDate', 'desc'),
                default => $query->orderBy('releaseDate', 'desc'),
            };

            if ($request->input('isHome') === 'true') {
                $query->orderBy('releaseDate', 'desc');
                $perPage = $request->input('limit', 12); // Mặc định 12 cho isHome
            }

            return $query->paginate($perPage)->through(function ($story) {
                return [
                    'storyId' => $story->storyId,
                    'title' => $story->title,
                    'author' => $story->author,
                    'coverImage' => $story->coverImage,
                    'genres' => $story->genres->map(function ($genre) {
                        return [
                            'genreId' => $genre->genreId,
                            'genreName' => $genre->genreName,
                        ];
                    })->toArray(),
                    'chapters' => $story->chapters_count,
                    'releaseDate' => $story->releaseDate,
                    'rating' => $story->ratings_avg_rating ? round($story->ratings_avg_rating, 1) : null,
                    'ratingCount' => $story->ratings_count ?? 0, // Đồng bộ tên trường
                ];
            });
        });

        return response()->json([
            'data' => $stories->items(),
            'pagination' => [
                'current_page' => $stories->currentPage(),
                'total_pages' => $stories->lastPage(),
                'total_items' => $stories->total(),
                'per_page' => $stories->perPage(),
            ]
        ]);
    }

    /**
     * Store a new chapter for a story
     */
    public function storeChapter(Request $request, $storyId)
    {
        $story = Story::where('storyId', $storyId)->first();

        if (!$story) {
            return response()->json(['message' => 'Story not found'], 404);
        }

        $request->validate([
            'title' => 'required|string',
            'chapterNumber' => 'required|integer|min:1',
            'imageUrls' => 'required|array',
        ]);

        $chapter = Chapter::create([
            'storyId' => $storyId,
            'title' => $request->title,
            'chapterNumber' => $request->chapterNumber,
            'chapterId' => Str::uuid()->toString(),
            'imageUrls' => json_encode($request->imageUrls),
        ]);

        return response()->json([
            'message' => 'Chapter created successfully',
            'chapter' => $chapter
        ], 201);
    }

    /**
     * Update an existing chapter
     */
    public function updateChapter(Request $request, $storyId, $chapterId)
    {
        $chapter = Chapter::where('storyId', $storyId)
            ->where('chapterId', $chapterId)
            ->first();

        if (!$chapter) {
            return response()->json(['message' => 'Chapter not found'], 404);
        }

        $request->validate([
            'title' => 'string',
            'chapterNumber' => 'integer|min:1',
        ]);

        if ($request->has('title')) $chapter->title = $request->title;
        if ($request->has('chapterNumber')) $chapter->chapterNumber = $request->chapterNumber;

        $chapter->save();

        return response()->json([
            'message' => 'Chapter updated successfully',
            'chapter' => $chapter
        ]);
    }

    /**
     * Delete a chapter
     */
    public function destroyChapter($storyId, $chapterId)
    {
        $chapter = Chapter::where('storyId', $storyId)
            ->where('chapterId', $chapterId)
            ->first();

        if (!$chapter) {
            return response()->json(['message' => 'Chapter not found'], 404);
        }

        $chapter->delete();

        return response()->json(['message' => 'Chapter deleted successfully']);
    }
}