"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Story } from "@/models/story";
import { StoryService } from "@/services/storyService";
import EditStoryModal from "@/components/EditStoryModal";
import AddStoryModal from "@/components/AddStoryModal";
import { motion } from "framer-motion";

export default function StoryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StoryService.getAllStories();
        setStories(data);
      } catch (error) {
        console.error("Error loading stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (storyId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa truyện này?")) return;

    try {
      await StoryService.deleteStory(storyId);
      setStories((prevStories) =>
        prevStories.filter((story) => story.storyId !== storyId)
      );
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Tiêu đề và nút Thêm truyện */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Quản Lý Truyện</h1>
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Thêm truyện mới
          </motion.button>
        </div>

        <div className="space-y-6">
          {stories.length > 0 ? (
            stories.map((story) => (
              <motion.div
                key={story.storyId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
                  translateY: -5,
                }}
                className="relative bg-white bg-opacity-90 mt-4 backdrop-blur-md rounded-lg p-5 flex items-start gap-4 shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/admin/story/${story.storyId}`)}
              >
                <motion.div
                  whileHover={{
                    rotateY: 10,
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="w-[80px] h-[130px] rounded-md overflow-hidden"
                >
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    width={80}
                    height={130}
                    className="rounded-md object-cover shadow-lg"
                  />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tác giả: {story.author}
                  </p>
                  <p className="text-sm text-gray-500">{story.description}</p>
                </div>

                {/* Thông tin bên phải */}
                <div className="flex flex-col items-end text-right space-y-2">
                  <p className="text-yellow-500 font-semibold">
                    ⭐ {story.rating?.toFixed(1) || "Chưa có"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Phát hành:{" "}
                    {new Date(story.releaseDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingStory(story);
                      }}
                      className="text-lg px-4 py-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    >
                      Sửa
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(story.storyId);
                      }}
                      className="text-lg px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Xóa
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-600"
            >
              Không có truyện nào.
            </motion.p>
          )}
        </div>

        {editingStory && (
          <EditStoryModal
            story={editingStory}
            onClose={() => setEditingStory(null)}
            onSave={() => {
              setIsLoading(true);
              const fetchData = async () => {
                try {
                  const data = await StoryService.getAllStories();
                  setStories(data);
                } catch (error) {
                  console.error("Error loading stories:", error);
                } finally {
                  setIsLoading(false);
                }
              };
              fetchData();
            }}
          />
        )}

        {isAddModalOpen && (
          <AddStoryModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={() => {
              setIsLoading(true);
              const fetchData = async () => {
                try {
                  const data = await StoryService.getAllStories();
                  setStories(data);
                } catch (error) {
                  console.error("Error loading stories:", error);
                } finally {
                  setIsLoading(false);
                }
              };
              fetchData();
            }}
          />
        )}
      </div>
    </div>
  );
}
