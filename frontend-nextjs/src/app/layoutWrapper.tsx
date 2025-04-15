// LayoutWrapper.tsx
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
  const { isLogged, refreshToken, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin") || false;

  useEffect(() => {
    if (isLogged) {
      console.log("🔹 LayoutWrapper: User is logged in.");

      const refreshInterval = setInterval(() => {
        console.log("🔄 Auto refreshing token...");
        refreshToken().catch(() => {
          console.error("🔴 Auto refresh failed! Logging out...");
          alert("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.");
          clearAuth();
          router.push("/auth/signin");
        });
      }, 110 * 60 * 1000); // 110 minutes

      return () => {
        console.log("🔻 Cleaning up interval...");
        clearInterval(refreshInterval);
      };
    }
  }, [isLogged, refreshToken, clearAuth, router]);

  return (
    <>
      {!isAdminPage && <Navbar />}

      <main className="flex-1">{children}</main>

      {!isAdminPage && <Divider className="my-4" />}
      {!isAdminPage && <Footer />}
    </>
  );
}
