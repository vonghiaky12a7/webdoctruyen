"use client";

import Image from "next/image";
import Link from "next/link";
import { Story } from "../models/story";

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const rating = story.rating || 0;
  const chapters = story.chapters || 0;

  const renderStars = (rating: number) => {
    if (!rating || isNaN(rating)) rating = 0;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span
            key={i}
            className="text-yellow-400 text-[10px] sm:text-xs md:text-sm"
          >
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span className="text-yellow-400 text-[10px] sm:text-xs md:text-sm">
            ☆
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span
            key={i + fullStars}
            className="text-gray-300 text-[10px] sm:text-xs md:text-sm"
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link
      href={`/stories/${story.storyId}`}
      className="hover:no-underline block"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-300 ease-in-out overflow-hidden flex flex-col w-full">
        {/* Ảnh */}
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={story.coverImage || "/placeholder.svg"}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="rounded-t-xl object-cover"
          />
        </div>

        {/* Nội dung */}
        <div className="p-2 sm:p-3 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base line-clamp-1">
            {story.title}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate line-clamp-1">
            Tác giả: {story.author}
          </p>
          <div className="flex items-center justify-between mt-1 sm:mt-2">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
              📖 {chapters}
            </p>
            <div className="flex items-center gap-1">{renderStars(rating)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
