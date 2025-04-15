/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Divider } from "@heroui/react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLogged, checkAuthStatus, refreshToken, clearAuth, getExpiresAt } =
    useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const initializeAuth = async () => {
      // Chỉ kiểm tra trạng thái xác thực nếu đang ở trang admin hoặc đã đăng nhập
      if (isAdminPage || isLogged) {
        try {
          await checkAuthStatus();
        } catch (error) {
          console.error("Auth check failed:", error);
          if (isAdminPage) {
            router.push("/auth/signin");
          }
        }
      }
    };

    initializeAuth();

    let refreshInterval: NodeJS.Timeout | undefined;

    const scheduleTokenRefresh = () => {
      if (!isLogged) return;

      const expiresAt = getExpiresAt();
      if (!expiresAt) {
        clearAuth();
        if (isAdminPage) router.push("/auth/signin");
        return;
      }

      const timeUntilExpiration = expiresAt - Date.now();
      const bufferTime = 60 * 1000; // 1 phút trước khi hết hạn
      const refreshTime = Math.max(timeUntilExpiration - bufferTime, 0);

      console.log(`Scheduling token refresh in ${refreshTime / 1000} seconds`);

      refreshInterval = setTimeout(async () => {
        try {
          await refreshToken();
          console.log("Token refreshed successfully");
          scheduleTokenRefresh(); // Lên lịch lại sau khi refresh thành công
        } catch (error) {
          console.error("Token refresh failed:", error);
          clearAuth();
          if (isAdminPage) router.push("/auth/signin");
        }
      }, refreshTime);
    };

    if (isLogged) {
      scheduleTokenRefresh();
    }

    return () => {
      if (refreshInterval) {
        console.log("Clearing refresh interval");
        clearTimeout(refreshInterval);
      }
    };
  }, [isLogged, pathname]);

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminPage && <Divider className="my-4" />}
      {!isAdminPage && <Footer />}
    </>
  );
}