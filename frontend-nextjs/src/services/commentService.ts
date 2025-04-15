import axiosInstance from "../utils/axiosInstance";
import { Comment } from "../models/comment";

export const CommentService = {
  getComments: async (storyId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/stories/${storyId}/comments`);
    return response.data.comments;
  },

  addComment: async (
    userId: string,
    storyId: string,
    content: string
  ): Promise<Comment> => {
    const response = await axiosInstance.post("/stories/comment", {
      userId,
      storyId,
      content,
    });
    return response.data.comment;
  },
};
