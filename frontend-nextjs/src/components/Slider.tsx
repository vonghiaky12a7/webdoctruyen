"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StoryService } from "../services/storyService";
import { Story } from "../models/story";

const Slider = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await StoryService.getStoriesByFilter({
        limit: 5,
        sort: "rating",
      }
      );
      if (Array.isArray(response)) {
        setStories(response);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (stories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === stories.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [stories.length]);

  const handleClickStory = useCallback(
    (storyId: string) => {
      router.push(`/stories/${storyId}`);
    },
    [router]
  );

  if (isLoading || stories.length === 0) {
    return null; // Or a loading spinner
  }

  return (
    <section className="relative max-h-200 bg-cover bg-center bg-no-repeat mx-auto my-5 rounded-lg bg-gradient-to-r from-[#e3dbdb] via-[#e0f1af] to-[#e3dbdb] dark:from-[#052222] dark:via-[#274753] dark:to-[#1d223f]">
      <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
      <div className="relative max-w-4xl mx-auto p-7">
        <div className="relative h-56 md:h-96 overflow-hidden rounded-lg">
          {stories.map((story, index) => (
            <div
              key={story.storyId}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => handleClickStory(story.storyId)}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? "bg-blue-300" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;
