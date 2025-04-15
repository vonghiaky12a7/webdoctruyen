/* eslint-disable @typescript-eslint/no-explicit-any */
// services/chapterService.ts
import axiosInstance from "@/utils/axiosInstance";

const API_URL = "/stories";

export const ChapterService = {
  getChaptersByStory: async (storyId: string) => {
    const response = await axiosInstance.get(`${API_URL}/${storyId}/chapters`);
    return response.data;
  },

  getChapter: async (storyId: string, chapterId: string) => {
    const response = await axiosInstance.get(
      `${API_URL}/${storyId}/chapter/${chapterId}`
    );
    return response.data;
  },

  createChapter: async (
    storyId: string,
    chapterData: { title: string; chapterNumber: number; imageUrls: string[] }
  ) => {
    const response = await axiosInstance.post(
      `${API_URL}/${storyId}/chapters`,
      chapterData
    );
    return response.data;
  },

  updateChapter: async (
    storyId: string,
    chapterId: string,
    chapterData: { title: string; chapterNumber: number; imageUrls: string[] }
  ) => {
    console.log("Updating chapter with data:", chapterData); // Debug log
    const response = await axiosInstance.put(
      `${API_URL}/${storyId}/chapter/${chapterId}`,
      chapterData
    );
    return response.data;
  },

  deleteChapter: async (storyId: string, chapterId: string) => {
    const response = await axiosInstance.delete(
      `${API_URL}/${storyId}/chapter/${chapterId}`
    );
    return response.data;
  },
};
