"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import LoadingError from "@/components/ui/detail-story/LoadingError";
import { Chapter } from "@/models/chapter";
import { Story } from "@/models/story";
import { Comment } from "@/models/comment";
import { ChapterService } from "@/services/chapterService";
import { CommentService } from "@/services/commentService";
import { FavoriteService } from "@/services/favoriteService";
import { StoryService } from "@/services/storyService";
import Sidebar from "./Sidebar";
import ChapterList from "./ChapterList";
import StoryInfo from "./StoryInfo";

export default function DetailStory() {
  const { id } = useParams() as { id?: string };
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newestStories, setNewestStories] = useState<Story[]>([]);
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuthStore();
  const userId = user?.id || null;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          storyData,
          newestData,
          topStoriesData,
          chaptersData,
          favoriteStatus,
          commentsData,
        ] = await Promise.all([
          StoryService.getStoryById(id),
          StoryService.getStoriesByFilter({ limit: 7, sort: "newest" }),
          StoryService.getStoriesByFilter({ limit: 7, sort: "rating" }),
          ChapterService.getChaptersByStory(id),
          userId
            ? FavoriteService.checkFavorite(userId, id)
            : Promise.resolve(false),
          CommentService.getComments(id),
        ]);

        setStory(storyData);
        setNewestStories(newestData);
        setTopStories(topStoriesData);
        setChapters(chaptersData);
        setIsLiked(favoriteStatus);
        setComments(commentsData);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Không thể tải thông tin truyện. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  return (
    <section className="my-6 px-4 sm:my-10 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <LoadingError isLoading={isLoading} error={error} />
      {story && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <StoryInfo
              story={story}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              userId={userId}
            />
            <ChapterList storyId={story.storyId} chapters={chapters} />
          </div>
          <Sidebar
            newestStories={newestStories}
            topStories={topStories}
            comments={comments}
            setComments={setComments}
            storyId={id}
            userId={userId}
          />
        </div>
      )}
    </section>
  );
}
