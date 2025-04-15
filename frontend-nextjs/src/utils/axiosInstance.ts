/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/axiosInstance.ts

import axios, { AxiosError } from "axios";
import { getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
});

// Request Interceptor: Thêm token vào header nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = getCookie("access_token"); // Lấy token từ cookie
    console.log("token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi và làm mới token
axiosInstance.interceptors.response.use(
  (response) => response, // Trả về phản hồi nếu thành công
  async (error: AxiosError) => {
    const originalRequest = error.config as any; // Lưu yêu cầu gốc

    // Xử lý lỗi 401 (token hết hạn)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu để tránh vòng lặp vô hạn
      try {
        const refreshToken = getCookie("refresh_token");
        console.log("refreshToken", refreshToken);
        
        if (!refreshToken) throw new Error("No refresh token available");

        // Gọi API làm mới token
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        const { access_token, refresh_token, expires_at } = response.data;

        // Lưu token mới vào cookie
        setCookie("access_token", access_token);
        setCookie("refresh_token", refresh_token);
        setCookie("expires_at", expires_at);

        // Thêm token mới vào yêu cầu gốc và thử lại
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Xóa cookie và chuyển hướng đến đăng nhập nếu cần (xử lý ở client-side)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        // window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    const errorMessage =
      (error.response?.data as any)?.message ||
      error.message ||
      "Something went wrong";
    console.error(`API error [${error.response?.status}]:`, errorMessage);

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
