// services/readingProgressService.ts
import axiosInstance from "@/utils/axiosInstance";

export interface ReadingProgressData {
  storyId: string;
  lastChapterId: string | null;
  lastPage: number;
  lastReadAt?: string;
}

export const ReadingProgressService = {
  // Lấy tiến độ đọc từ server
  async getProgress(storyId: string): Promise<ReadingProgressData | null> {
    try {
      const response = await axiosInstance.get(`/reading-progress/${storyId}`);
      return response.data.progress ?? null;
    } catch (err) {
      console.error("Error fetching reading progress:", err);
      return null;
    }
  },

  // Gửi tiến độ đọc mới lên server
  async createProgress(
    storyId: string,
    chapterId: string,
    page: number
  ): Promise<void> {
    try {
      const data: ReadingProgressData = {
        storyId,
        lastChapterId: chapterId,
        lastPage: page,
        lastReadAt: new Date().toISOString(),
      };
      await axiosInstance.post("/reading-progress", data);
    } catch (err) {
      console.error("Error saving reading progress:", err);
    }
  },
};
