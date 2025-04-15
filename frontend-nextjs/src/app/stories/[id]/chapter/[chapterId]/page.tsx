"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import NextImage from "next/image";
import { StoryService } from "@/services/storyService";
import { ChapterService } from "@/services/chapterService";
import { ReadingProgressService } from "@/services/readingProgressService";
import { Chapter } from "@/models/chapter";
import { Story } from "@/models/story";
import { useAuthStore } from "@/stores/authStore";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ChapterPage() {
  const { isLogged } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const chapterId = params?.chapterId as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [initialSlide, setInitialSlide] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StoryService.getChapterById(id, chapterId);
        const storyData = await StoryService.getStoryById(id);
        const chapterList = await ChapterService.getChaptersByStory(id);

        if (!data || !data.imageUrls) {
          setError("Invalid chapter data");
          return;
        }

        const imageUrlsArray = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : data.imageUrls.split(",");

        setChapter({ ...data, imageUrls: imageUrlsArray });
        setStory(storyData);
        setChapters(chapterList);

        // Get progress from API
        if (isLogged) {
          const progress = await ReadingProgressService.getProgress(id);
          const savedIndex =
            progress?.lastChapterId === chapterId ? progress.lastPage : 0;
          setInitialSlide(!isNaN(savedIndex) ? savedIndex : 0);
        }
      } catch (err: unknown) {
        console.log(err);
        setError("Failed to fetch chapter data");
      } finally {
        setLoading(false);
      }
    };

    if (id && chapterId) {
      fetchData();
    }
  }, [id, chapterId, isLogged]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chapter]);

  const handleChapterChange = (offset: number) => {
    if (!chapters.length || !chapter) return;

    const currentIndex = chapters.findIndex((c) => c.chapterId === chapterId);
    const newIndex = currentIndex + offset;

    if (newIndex >= 0 && newIndex < chapters.length) {
      const newChapterId = chapters[newIndex].chapterId;
      router.push(`/stories/${id}/chapter/${newChapterId}`);
    }
  };

  const handleSlideChange = (index: number, isLast: boolean) => {
    if (!isLogged) return;
    const pageToSave = isLast ? 0 : index;
    ReadingProgressService.createProgress(id, chapterId, pageToSave);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10">{error}</div>;
  if (!chapter || !chapter.imageUrls?.length)
    return <div className="text-center py-10">Chapter not found</div>;

  return (
    <div ref={contentRef} className="flex flex-col w-full h-screen">
      <div className="w-full bg-black bg-opacity-70 text-white py-4 flex justify-between items-center px-6">
        <button
          onClick={() => router.push(`/stories/${id}`)}
          className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          ⬅ Quay lại
        </button>

        <h1 className="text-xl font-semibold text-center">
          {story?.title} - {chapter.title}
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => handleChapterChange(-1)}
            className="px-6 py-3 text-xl bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            ◀ Chương trước
          </button>
          <button
            onClick={() => handleChapterChange(1)}
            className="px-6 py-3 text-xl bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Chương sau ▶
          </button>
        </div>
      </div>

      <div className="flex-grow relative">
        {chapter && chapter.imageUrls && !loading && (
          <Swiper
            key={initialSlide}
            modules={[Navigation, Pagination]}
            navigation
            className="w-full h-full"
            initialSlide={initialSlide}
            onSlideChange={(swiper) => {
              const currentIndex = swiper.activeIndex;
              const isLastSlide = currentIndex === swiper.slides.length - 1;
              handleSlideChange(currentIndex, isLastSlide);
            }}
          >
            {chapter.imageUrls.map((imageUrl, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div className="relative w-full h-full flex justify-center items-center">
                  <NextImage
                    src={imageUrl}
                    alt={`Chapter ${chapter.chapterNumber} - ${chapter.title}`}
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
