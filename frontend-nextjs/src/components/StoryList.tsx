"use client";

import { useState, useEffect } from "react";
import { Story } from "../models/story";
import { StoryService } from "../services/storyService";
import StoryCard from "./StoryCard";
import LoadingError from "./ui/detail-story/LoadingError";
import TrendingStories from "./TrendingStories";

function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await StoryService.getAllStories();
        setStories(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải truyện. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  return (
    <section className="my-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
      {/* Phần New & Trending */}
      <TrendingStories />

      {/* Divider */}
      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      {/* Danh sách truyện mới cập nhật */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 pl-2 tracking-tight text-gray-900 dark:text-white">
          Truyện Mới Cập Nhật
        </h2>
        <LoadingError isLoading={isLoading} error={error} />
        {!isLoading && !error && stories.length === 0 && (
          <p className="text-gray-500">Không có truyện nào để hiển thị.</p>
        )}
        {!isLoading && !error && stories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
            {stories.map((story) => (
              <StoryCard key={story.storyId} story={story} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default StoryList;
