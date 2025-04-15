/* eslint-disable @typescript-eslint/no-unused-vars */
// services/imgService.ts
import axiosInstance from "@/utils/axiosInstance";

const IMAGE_API_URL = "/upload";

export const ImgService = {
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosInstance.post(
      `${IMAGE_API_URL}/single`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.url;
  },

  uploadStoryBackground: async (
    file: File,
    storyName: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "background"); // Hoặc "avatar"
    formData.append("story_name", storyName); // storyName chính là tên câu chuyện bạn truyền vào
    const response = await axiosInstance.post(
      `${IMAGE_API_URL}/single`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.url;
  },

  uploadChapterImages: async (
    files: File[],
    storyName: string,
    chapterNumber: number
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      const customFileName = `${storyName}_Chapter_${chapterNumber}_${file.name}`;
      formData.append("images[]", file, customFileName);
    });
    const response = await axiosInstance.post(
      `${IMAGE_API_URL}/multiple`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.images.map((img: { url: string }) => img.url);
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      console.log("Image URL to be deleted:", imageUrl);
  
      // Trích xuất public_id đầy đủ từ URL
      const matches = imageUrl.match(/upload\/(?:v\d+\/)?(.*)\.[a-z]+$/);
      const publicId = matches?.[1];
  
      if (!publicId) {
        console.error("Không thể lấy được public_id từ URL:", imageUrl);
        return;
      }
  
      console.log("Public ID to be deleted:", publicId);
  
      // Gửi publicId (chứ không phải imageUrl nữa)
      await axiosInstance.post(`${IMAGE_API_URL}/delete`, { publicId });
  
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }  
    
};
