// services/userService.ts
import { User } from "@/models/user";
import axiosInstance from "@/utils/axiosInstance";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  updateUserRole: async (userId: string, roleId: number): Promise<User> => {
    const response = await axiosInstance.put(`/users/${userId}`, { roleId });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/users/${userId}`);
  },
};
