// components/search/SearchFilters.tsx
"use client";

import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { Search } from "lucide-react";
import { Genre } from "@/models/genre";

interface SearchFiltersProps {
  searchTerm: string;
  selectedGenres: number[];
  sortBy: string;
  genres: Genre[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (
    keys: "all" | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  ) => void;
  handleGenreChange: (
    keys: "all" | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  ) => void;
}

export default function SearchFilters({
  searchTerm,
  selectedGenres,
  sortBy,
  genres,
  handleSearchChange,
  handleSortChange,
  handleGenreChange,
}: SearchFiltersProps) {
  return (
    <div className="">
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <form className="w-full md:w-2/4 flex">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên truyện, tác giả..."
                aria-label="Tìm kiếm truyện"
                value={searchTerm}
                onChange={handleSearchChange}
                startContent={
                  <Search className="text-muted-foreground h-4 w-4" />
                }
                fullWidth
                className="h-10"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 w-full md:w-2/5 justify-end">
            <Select
              selectedKeys={[sortBy]}
              onSelectionChange={handleSortChange}
              aria-label="Sắp xếp theo"
              placeholder="Sắp xếp theo"
              className="h-10"
            >
              <SelectItem key="newest">Mới nhất</SelectItem>
              <SelectItem key="oldest">Cũ nhất</SelectItem>
              <SelectItem key="rating">Đánh giá cao</SelectItem>
            </Select>

            <Select
              placeholder="Thể loại"
              selectionMode="multiple"
              aria-label="Sắp xếp theo thể loại"
              selectedKeys={selectedGenres.map(String)}
              onSelectionChange={handleGenreChange}
              className="w-56 h-10"
            >
              {genres.map((genre) => (
                <SelectItem key={genre.genreId}>
                  {genre.genreName}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
