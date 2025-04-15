import Link from "next/link";
import Image from "next/image";
import { Story } from "@/models/story";

interface StoryListProps {
  newestStories: Story[];
  topStories: Story[];
  activeTab: "newest" | "top";
  setActiveTab: (tab: "newest" | "top") => void;
}

export default function StoryList({
  newestStories,
  topStories,
  activeTab,
  setActiveTab,
}: StoryListProps) {
  const storiesToShow = activeTab === "newest" ? newestStories : topStories;

  return (
    <div className="bg-white p-6 rounded-lg border shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="flex border-b justify-center sticky top-0 bg-white z-10 mb-4 dark:bg-gray-800">
        {["newest", "top"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-base font-semibold ${
              activeTab === tab
                ? "border-b-2 border-purple-600 text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(tab as "newest" | "top")}
          >
            {tab === "newest" ? "Mới nhất" : "Top truyện"}
          </button>
        ))}
      </div>
      <ul className="space-y-3 max-h-[430px] overflow-y-auto">
        {storiesToShow.map((storyItem, index) => (
          <Link
            key={storyItem.storyId}
            href={`/stories/${storyItem.storyId}`}
            passHref
          >
            <li className="flex items-center space-x-3 border-b pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 transition dark:border-b-gray-100 rounded-sm">
              <span
                className={`text-base font-bold ${
                  index < 3 ? "text-red-500" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Image
                src={storyItem.coverImage}
                alt={storyItem.title}
                priority
                width={40}
                height={40}
                className="rounded-lg object-cover w-10 h-10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold text-sm truncate dark:text-white">
                  {storyItem.title}
                </p>
                {activeTab === "newest" && (
                  <p className="text-gray-500 text-xs dark:text-gray-400">
                    {new Date(storyItem.releaseDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                )}
              </div>
              {activeTab === "top" && (
                <p className="text-gray-600 text-xs whitespace-nowrap dark:text-gray-400">
                  ⭐{" "}
                  {typeof storyItem.rating === "number"
                    ? storyItem.rating.toFixed(1)
                    : "0.0"}{" "}
                  ({storyItem.ratingCount || 0})
                </p>
              )}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
