// CommentSection.tsx
import { useState } from "react";
import Image from "next/image";
import { Comment } from "@/models/comment";
import { CommentService } from "@/services/commentService";

interface CommentSectionProps {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  storyId: string | undefined;
  userId: string | null;
}

export default function CommentSection({
  comments,
  setComments,
  storyId,
  userId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!userId || !storyId) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const addedComment = await CommentService.addComment(
        userId,
        storyId,
        newComment
      );
      setComments([addedComment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      alert("Đã xảy ra lỗi khi thêm bình luận!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-lg dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-black mb-4 dark:text-white">Bình luận</h2>
      {userId && (
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Gửi
          </button>
        </div>
      )}
      {comments.length > 0 ? (
        <ul className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
          {comments.map((comment) => (
            <li key={comment.id} className="flex items-start space-x-3">
              <Image
                src={
                  comment.user?.avatarPath ||
                  "https://th.bing.com/th/id/OIP.p6I4Gk3YVF46tW5yLg6yGwHaEH?rs=1&pid=ImgDetMain"
                }
                alt="Avatar"
                loading="lazy"
                width={40}
                height={40}
                className="rounded-full w-10 h-10"
              />
              <div>
                <p
                  className={`font-semibold ${
                    comment.userId === userId
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {comment.user?.username || "Ẩn danh"}
                </p>
                <p className="text-gray-700 dark:text-white">{comment.content}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {new Date(comment.created_at || "").toLocaleString("vi-VN")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-base">Chưa có bình luận nào.</p>
      )}
    </div>
  );
}
