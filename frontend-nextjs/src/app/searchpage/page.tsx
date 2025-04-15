"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { StoryService } from "@/services/storyService";
import { Story } from "@/models/story";
import { Genre } from "@/models/genre";
import Breadcrumb from "@/components/Breadcrumbs";
import SearchFilters from "@/components/ui/search/SearchFilters";
import StoryGridTilted from "@/components/ui/search/StoryGridTilted";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("title") || "");
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get("genres")
      ? searchParams.get("genres")!.split(",").map(Number)
      : []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [stories, setStories] = useState<Story[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [storyRatings, setStoryRatings] = useState<{ [key: string]: number }>(
    {}
  );

  const isLg = useMediaQuery({ minWidth: 1024 });
  const isMd = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isSm = useMediaQuery({ minWidth: 640, maxWidth: 767 });
  const priorityCount = isLg ? 16 : isMd ? 9 : isSm ? 4 : 1;

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await StoryService.getAllGenres();
        setGenres(data);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    loadGenres();
  }, []);

  const fetchFilteredStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { stories, total } = await StoryService.searchStories({
        title: searchTerm,
        genres: selectedGenres,
        sortBy,
        page: currentPage,
        limit: 8,
      });
      setStories(stories || []);
      setTotalItems(total || 0);

      if (stories?.length > 0) {
        const ratingsMap: { [key: string]: number } = {};
        stories.forEach((story) => {
          ratingsMap[story.storyId] = story.rating || 0;
        });
        setStoryRatings(ratingsMap);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStories([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedGenres, sortBy, currentPage]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchFilteredStories();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [fetchFilteredStories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
    updateSearchParams(value, selectedGenres, sortBy, 1);
  };

  const handleSortChange = (
    keys: "all" | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  ) => {
    if (keys === "all") return;
    const selectedKeys = Array.from(keys) as string[];
    if (selectedKeys.length > 0) {
      const newSortBy = selectedKeys[0];
      setSortBy(newSortBy);
      setCurrentPage(1); // Reset về trang 1
      updateSearchParams(searchTerm, selectedGenres, newSortBy, 1);
    }
  };

  const handleGenreChange = (
    keys: "all" | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  ) => {
    if (keys === "all") return;
    const selectedKeys = Array.from(keys) as string[];
    const newGenres = selectedKeys.map(Number);
    setSelectedGenres(newGenres);
    setCurrentPage(1); // Reset về trang 1
    updateSearchParams(searchTerm, newGenres, sortBy, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(searchTerm, selectedGenres, sortBy, page);
  };

  const updateSearchParams = (
    title: string,
    genres: number[],
    sort: string,
    page: number
  ) => {
    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (genres.length) params.set("genres", genres.join(","));
    params.set("sortBy", sort);
    params.set("page", page.toString());
    router.push(`/searchpage?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="bg-muted/50">
        <div className="container mx-auto py-2 px-4">
          <Breadcrumb items={[{ label: "Tìm Truyện" }]} />
        </div>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        selectedGenres={selectedGenres}
        sortBy={sortBy}
        genres={genres}
        handleSearchChange={handleSearchChange}
        handleSortChange={handleSortChange}
        handleGenreChange={handleGenreChange}
      />

      <StoryGridTilted
        stories={stories}
        genres={genres}
        storyRatings={storyRatings}
        isLoading={isLoading}
        searchTerm={searchTerm}
        priorityCount={priorityCount}
        totalPages={Math.ceil(totalItems / 8)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
