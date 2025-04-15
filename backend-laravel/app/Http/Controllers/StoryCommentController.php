<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class StoryCommentController extends Controller
{
    public function getComments($storyId)
    {
        $comments = Comment::where('storyId', $storyId)
            ->with('user:id,username,avatarPath')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['comments' => $comments]);
    }

    public function addComment(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|string',
            'storyId' => 'required|string|exists:stories,storyId',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'userId' => $validated['userId'],
            'storyId' => $validated['storyId'],
            'content' => $validated['content'],
        ]);

        $comment->load('user:id,username,avatarPath');

        return response()->json([
            'message' => 'Đã thêm bình luận mới',
            'comment' => $comment
        ]);
    }
    public function destroyById($commentId)
    {
        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
