// components/search/StoryCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { Story } from "@/models/story";
import { Genre } from "@/models/genre";

interface StoryCardProps {
  story: Story;
  genres: Genre[];
  storyRatings: { [key: string]: number };
  priority: boolean;
}

export default function StoryCard({
  story,
  genres,
  storyRatings,
  priority,
}: StoryCardProps) {
  // Render star rating
  const renderRating = (rating: number | undefined) => {
    if (rating === undefined) {
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-muted-foreground">
              ☆
            </span>
          ))}
        </div>
      );
    }
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <Link
      href={`/stories/${story.storyId}`}
      className="block h-full [transform:perspective(800px)_rotateY(0deg)] hover:[transform:perspective(800px)_rotateY(10deg)_rotateX(-5deg)] transition-transform duration-500"
    >
      <Card
        className="overflow-hidden flex flex-col h-full  shadow-lg rounded-lg transform-style-3d group"
        isHoverable
      >
        <div className="relative pt-[100%] overflow-hidden transform-style-3d">
          <Image
            src={story.coverImage || "/app/public/placeholder.svg"}
            alt={story.title}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="absolute top-0 left-0 object-cover transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <CardHeader className="pb-0 dark:text-white text-gray-900 transition-transform duration-500 group-hover:translate-z-[15px]">
          <div className="space-y-0.5">
            <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
              {story.title}
            </h3>
            <p className="text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              Tác giả: {story.author}
            </p>
          </div>
        </CardHeader>
        <CardBody className="flex-grow transition-transform duration-500 group-hover:translate-z-[10px]">
          <p className="text-sm text-muted-foreground group-hover:translate-z-[15px] line-clamp-1">
            {story.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {story.genreIds.map((genreId) => {
              const genre = genres.find((g) => g.genreId === genreId);
              return genre ? (
                <Chip
                  key={genreId}
                  className="text-white px-3 py-1 rounded-full shadow-sm transition-transform duration-500 group-hover:translate-z-[12px]"
                  variant="shadow"
                  size="sm"
                  color="danger"
                >
                  {genre.genreName}
                </Chip>
              ) : null;
            })}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between dark:text-white pt-1 border-t text-xs text-gray-800 transition-transform duration-500 group-hover:translate-z-[10px]">
          <div className="flex items-center gap-1">
            <span>{story.chapters || 0} chương</span>
          </div>
          {renderRating(story.rating || storyRatings[story.storyId])}
        </CardFooter>
      </Card>
    </Link>
  );
}
