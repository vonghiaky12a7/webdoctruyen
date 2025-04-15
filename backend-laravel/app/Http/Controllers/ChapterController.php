<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChapterController extends Controller
{
    public function getChapters($storyId)
    {
        $chapters = Chapter::where('storyId', $storyId)
            ->orderBy('chapterNumber', 'asc')
            ->get();

        return response()->json($chapters);
    }

    public function getChapter($storyId, $chapterId)
    {
        $chapter = Chapter::where('storyId', $storyId)
            ->where('chapterId', $chapterId)
            ->first();

        if (!$chapter) {
            return response()->json(['message' => 'Chapter not found'], 404);
        }

        return response()->json($chapter);
    }

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
            'imageUrls' => 'required|array',
        ]);

        if ($request->has('title')) $chapter->title = $request->title;
        if ($request->has('chapterNumber')) $chapter->chapterNumber = $request->chapterNumber;
        if ($request->has('imageUrls')) $chapter->imageUrls = $request->imageUrls;

        $chapter->save();

        return response()->json([
            'message' => 'Chapter updated successfully',
            'chapter' => $chapter
        ]);
    }

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
