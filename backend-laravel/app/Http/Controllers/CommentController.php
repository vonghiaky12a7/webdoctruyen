<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function getComments($storyId)
    {
        $comments = Comment::where('storyId', $storyId)
            ->with('user:username,avatarPath') // Lấy thông tin cơ bản của người dùng
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['comments' => $comments]);
    }

    public function addComment(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|uuid|exists:users,id',
            'storyId' => 'required|uuid|exists:stories,storyId',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create(array_merge($validated, ['commentId' => \Illuminate\Support\Str::uuid()]));
        $comment->load('user:username,avatarPath'); // Load thông tin user sau khi tạo
        return response()->json(['message' => 'Đã thêm bình luận mới', 'comment' => $comment]);
    }

    /**
     * Lấy danh sách bình luận của một người dùng
     */
    public function getUserComments($userId)
    {
        $comments = Comment::where('userId', $userId)
            ->with('story:id,title') // Lấy thông tin cơ bản của truyện
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'comments' => $comments,
            'total' => $comments->count(),
        ]);
    }

    /**
     * Xóa bình luận của người dùng
     */
    public function destroyById($commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $comment->delete();

        return response()->json(['message' => 'Đã xóa bình luận thành công']);
    }
}