import axiosInstance from "@/utils/axiosInstance";

export const authService = {
  login: async (formData: FormData) => {

    const response = await axiosInstance.post("/auth/login", formData);
    return response.data;

  },

  signup: async (formData: FormData) => {
    const response = await axiosInstance.post("/auth/register", formData);
    return response.data;
  },

  logout: async () => {

    await axiosInstance.post("/auth/logout");

  },

  getProfile: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  requestPasswordReset: async (formData: FormData) => {

    const res = await axiosInstance.post("/auth/forgot-password", formData);
    return { status: res.status, message: res.data.message };
  },

  resetPassword: async (formData: FormData) => {
    const res = await axiosInstance.post("/auth/reset-password", formData);
    return res.data;

  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh-token", null);
    return response.data;
  },

  // Thêm phương thức để lấy URL đăng nhập Google
  googleLogin: async () => {
    const response = await axiosInstance.post("/auth/google");
    return response.data;
  },
};
