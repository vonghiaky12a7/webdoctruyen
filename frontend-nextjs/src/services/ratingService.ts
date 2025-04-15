/* eslint-disable @typescript-eslint/no-explicit-any */
// services/ratingService.ts
import axiosInstance from "@/utils/axiosInstance";

export const RatingService = {
  addRating: async (
    userId: string,
    storyId: string,
    rating: number
  ): Promise<any> => {
    const response = await axiosInstance.post("/stories/rating", {
      userId,
      storyId,
      rating,
    });
    return response.data;
  },

  getRatingsByStoryId: async (storyId: string): Promise<any> => {
    const response = await axiosInstance.get(`/stories/${storyId}/ratings`);
    return response.data;
  },

  getRatingsByStoryIds: async (storyIds: string[]) => {
    const response = await axiosInstance.get("/ratings", {
      params: { storyIds: storyIds.join(",") },
    });
    return response.data;
  },
};
