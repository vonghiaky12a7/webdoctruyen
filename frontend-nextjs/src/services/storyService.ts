/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosInstance";
import { Story } from "@/models/story";
import { Genre } from "@/models/genre";

// API endpoints
const STORY_API_URL = "/stories";
const GENRE_API_URL = "/genres";

// Sort options
const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  RATING: "rating",
} as const;

export const StoryService = {
  // Basic CRUD operations
  getAllStories: async (): Promise<Story[]> => {
    const response = await axiosInstance.get(STORY_API_URL);
    return response.data.data;
  },

  getStoryById: async (id: string): Promise<Story> => {
    const response = await axiosInstance.get(`${STORY_API_URL}/${id}`);
    return response.data;
  },

  createStory: async (storyData: any) => {
    const response = await axiosInstance.post(STORY_API_URL, storyData);
    return response.data;
  },

  updateStory: async (storyId: string, storyData: any) => {
    const response = await axiosInstance.put(
      `${STORY_API_URL}/${storyId}`,
      storyData
    );
    return response.data;
  },

  deleteStory: async (storyId: string) => {
    const response = await axiosInstance.delete(`${STORY_API_URL}/${storyId}`);
    return response.data;
  },

  // Story listing and filtering
  getStoriesByFilter: async (
    options: { limit?: number; sort?: string } = {}
  ): Promise<Story[]> => {
    const { limit = 5, sort = SORT_OPTIONS.NEWEST } = options;
    const response = await axiosInstance.get(`${STORY_API_URL}/list`, {
      params: {
        limit,
        sortBy: sort,
      },
    });
    return response.data.data; // Chỉ lấy mảng truyện từ 'data'
  },

  searchStories: async ({
    title,
    genres,
    sortBy,
    page = 1, // Thêm page mặc định là 1
    limit = 8, // Đặt limit mặc định là 8
  }: {
    title?: string;
    genres?: number[];
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stories: Story[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (title) queryParams.append("title", title);
    if (genres?.length) queryParams.append("genres", genres.join(","));
    if (sortBy) queryParams.append("sortBy", sortBy);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const response = await axiosInstance.get(
      `${STORY_API_URL}/list?${queryParams.toString()}`
    );
    return {
      stories: response.data.data,
      total: response.data.pagination.total_items,
    };
  },

  // Genre operations
  getAllGenres: async (): Promise<Genre[]> => {
    const response = await axiosInstance.get(GENRE_API_URL);
    return response.data;
  },

  // Chapter operations
  getChapterById: async (storyId: string, chapterId: string) => {
    const response = await axiosInstance.get(
      `${STORY_API_URL}/${storyId}/chapter/${chapterId}`
    );
    return response.data;
  },
};
