// components/ReadingHistory.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance"; // Đảm bảo bạn đã cấu hình axiosInstance để gọi API

interface Story {
  storyId: string;
  title: string;
  author: string;
  coverImage: string;
  releaseDate: string;
}

interface ReadingProgress {
  story: Story;
  lastReadAt: string;
}

export default function ReadingHistory() {
  const [history, setHistory] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadingHistory = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/reading-history", {
          withCredentials: true,
        });
        setHistory(response.data.history);
      } catch (err) {
        setError("Không thể tải lịch sử đọc. Vui lòng thử lại sau.");
        console.error("Lỗi khi lấy lịch sử đọc:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Bạn chưa đọc truyện nào. Hãy bắt đầu đọc ngay!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <Link
          key={item.story.storyId}
          href={`/stories/${item.story.storyId}`}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
        >
          <Image
            src={item.story.coverImage || "/placeholder.svg"}
            alt={item.story.title}
            width={80}
            height={80}
            className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
          />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                {index + 1}. {item.story.title}
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                {item.story.author}
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm sm:hidden">
                📅{" "}
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(item.story.releaseDate))}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm hidden sm:block whitespace-nowrap">
              📅{" "}
              {new Intl.DateTimeFormat("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(item.story.releaseDate))}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
