import { Story } from "@/models/story";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StoryService } from "../services/storyService";

const TrendingStories: React.FC = () => {
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [newStories, setNewStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchDataStories = async () => {
      try {
        // Sử dụng Promise.all để chạy đồng thời hai yêu cầu API
        const [topStories, latestStories] = await Promise.all([
          StoryService.getStoriesByFilter({ limit: 5, sort: "rating" }),
          StoryService.getStoriesByFilter({ limit: 5, sort: "newest" }),
        ]);

        // Cập nhật state sau khi nhận được dữ liệu
        setTrendingStories(topStories);
        setNewStories(latestStories);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách truyện:", error);
      }
    };

    fetchDataStories();
  }, []);

  return (
    <div className="mb-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
      <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 max-w-7xl mx-auto">
        {/* New Stories */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-6 pl-2 tracking-tight text-gray-900 dark:text-white">
            🎨 Truyện Mới
          </h1>
          <div className="space-y-4">
            {newStories.map((story, index) => (
              <Link
                key={story.storyId}
                href={`/stories/${story.storyId}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
              >
                <Image
                  src={story.coverImage || "/placeholder.svg"}
                  alt={story.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                      {index + 1}. {story.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {story.author}
                    </p>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm sm:hidden">
                      📅{" "}
                      {new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(story.releaseDate))}
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm hidden sm:block whitespace-nowrap">
                    📅{" "}
                    {new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(story.releaseDate))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Stories */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-6 pl-2 tracking-tight text-gray-900 dark:text-white">
            🔥 Thịnh Hành
          </h1>
          <div className="space-y-4">
            {trendingStories.map((story, index) => (
              <Link
                key={story.storyId}
                href={`/stories/${story.storyId}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
              >
                <Image
                  src={story.coverImage || "/placeholder.svg"}
                  alt={story.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                      {index + 1}. {story.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {story.author}
                    </p>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm sm:hidden">
                      ⭐ {story.rating?.toFixed(1) || "0"} (
                      {story.ratingCount || 0})
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm hidden sm:block whitespace-nowrap">
                    ⭐ {story.rating?.toFixed(1) || "0"} (
                    {story.ratingCount || 0})
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingStories;
