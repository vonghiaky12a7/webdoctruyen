"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/react";
import { useAuthStore } from "@/stores/authStore";
import LoadingComponent from "@/app/loading";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const handleGoogleCallback = async () => {
    const code = searchParams.get("code");
    if (!code) {
      addToast({
        title: "Error",
        description: "Không nhận được mã từ Google",
        color: "danger",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });
      router.replace("/auth/signin");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/callback?code=${code}`,
        {
          method: "GET",
          credentials: "include", // Để nhận cookie từ backend
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Lưu user vào authStore
        setAuth(data.user, true);
        addToast({
          title: "Success",
          description: "Đăng nhập bằng Google thành công",
          color: "success",
          timeout: 2500,
        });
        router.replace("/"); // Chuyển hướng về trang chủ
      } else {
        throw new Error("Đăng nhập bằng Google thất bại");
      }
    } catch (error) {
      console.error("Error during Google callback:", error);
      addToast({
        title: "Error",
        description: "Đăng nhập bằng Google thất bại. Vui lòng thử lại.",
        color: "danger",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });
      router.replace("/auth/signin"); // Quay lại trang đăng nhập nếu thất bại
    }
  };

  // Gọi handleGoogleCallback khi component được mount
  useEffect(() => {
    handleGoogleCallback();
  }, [searchParams]);

  return (
    <LoadingComponent/>
  );
}
