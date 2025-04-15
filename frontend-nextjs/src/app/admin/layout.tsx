"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Avatar from "@/components/Avatar";
import { useAuthStore } from "@/stores/authStore"; // Import useAuthStore

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLogged } = useAuthStore(); // Lấy user và isLogged từ useAuthStore

  const navItems = [
    { href: "/admin/user", label: "Users", icon: "lucide:user" },
    { href: "/admin/story", label: "Story", icon: "lucide:book-open" },
    { href: "/admin/genres", label: "Genres", icon: "lucide:list" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-primary-600 bg-gray-100"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon icon={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Avatar + Theme Switch */}
        <div className="flex items-center space-x-5">
          <ThemeSwitcher />
          {isLogged && user ? <Avatar user={user} /> : null}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 dark:bg-gray-700">
        {children}
      </div>
    </div>
  );
}
