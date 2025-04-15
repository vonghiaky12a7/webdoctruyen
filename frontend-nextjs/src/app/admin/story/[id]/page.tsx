/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { StoryService } from "@/services/storyService";
import { ChapterService } from "@/services/chapterService";
import { Story } from "@/models/story";
import { Chapter } from "@/models/chapter";
import { motion } from "framer-motion";
import EditChapterModal from "@/components/EditChapterModal"; // Thêm modal sửa chương
import AddChapterModal from "@/components/AddChapterModal";

export default function ChaptersPage() {
  const { id } = useParams(); // storyId từ URL
  const router = useRouter();

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState<boolean>(false);

  const nextChapterNumber = chapters.length > 0 
  ? Math.max(...chapters.map(chap => chap.chapterNumber)) + 1 
  : 1;

  useEffect(() => {
    fetchStoryAndChapters();
  }, [id]);

  async function fetchStoryAndChapters() {
    setLoading(true);
    setError(null);
    try {
      const storiesData = await StoryService.getStoryById(id as string);
      
      setStory(storiesData);
      const chaptersData = await ChapterService.getChaptersByStory(id as string);
      setChapters(chaptersData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setError("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(chapterId: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa chương này?")) return;
    try {
      await ChapterService.deleteChapter(id as string, chapterId);
      setChapters((prevChapters) =>
        prevChapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } catch (error) {
      console.error("Lỗi khi xóa chương:", error);
    }
  }

  if (loading)
    return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">{story?.title} - Danh sách chương</h2>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => setIsAddingChapter(true)} // Mở modal thêm chương mới
              className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600 transition"
            >
              + Thêm Chương Mới
            </motion.button>
            <motion.button
              onClick={() => router.back()}
              className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600 transition"
            >
              Đóng
            </motion.button>
          </div>
        </div>
  
        <div className="p-4 flex-1 overflow-y-auto max-h-[60vh]">
          {chapters.length > 0 ? (
            <ul className="space-y-2">
              {chapters.map((chapter) => (
                <motion.li
                  key={chapter.chapterId}
                  className="p-3 border rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white transition cursor-pointer flex justify-between items-center"
                >
                  <span onClick={() => setEditingChapter(chapter)} className="text-black">
                    Chương {chapter.chapterNumber}: {chapter.title}
                  </span>
                  <div className="flex space-x-2">
                    <motion.button
                      className="px-3 py-1 bg-indigo-500 text-white rounded-md"
                      onClick={() => setEditingChapter(chapter)}
                    >
                      Sửa
                    </motion.button>
                    <motion.button
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                      onClick={() => handleDelete(chapter.chapterId)}
                    >
                      Xóa
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không có chương nào.</p>
          )}
        </div>
      </div>
  
      {/* Modal thêm chương */}
      {isAddingChapter && (
        <AddChapterModal
          storyId={id as string}
          storyName={story?.title || ""}
          initialChapterNumber={nextChapterNumber} // Số chương tiếp theo
          onClose={() => setIsAddingChapter(false)}
          onSave={fetchStoryAndChapters}
        />
      )}
  
      {/* Modal chỉnh sửa chương */}
      {editingChapter && (
        <EditChapterModal
          storyName={story?.title || ""}
          chapter={editingChapter}
          onClose={() => setEditingChapter(null)}
          onSave={fetchStoryAndChapters}
        />
      )}
    </div>
  );
}
