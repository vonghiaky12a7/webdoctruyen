// components/Navbar.tsx
"use client";

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import Avatar from "./Avatar";
import { useAuthStore } from "@/stores/authStore";
import ImageHero from "./Image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@heroui/react";
import { User } from "@/models/user";

const navItems = [
  { href: "/", label: "Trang Chủ" },
  { href: "/admin/user", label: "Quản lý" },
  { href: "/searchpage", label: "Tìm truyện" },
  { href: "/contact", label: "Liên Hệ" },
];

export default function Navbar() {
  const { isLogged, user } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Lọc navItems dựa trên roleId
  const filteredNavItems = navItems.filter((item) => {
    if (item.href === "/admin/user") {
      return user?.roleId === 1; // Chỉ hiển thị "Quản lý" nếu roleId là 1
    }
    return true; // Giữ lại các mục khác
  });

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md mb-4">
      <div className="flex items-center justify-between mx-auto py-4 px-2 md:px-20">
        <Logo />
        <div className="flex items-center space-x-3 md:space-x-5 md:order-2">
          <RightSection isLogged={isLogged} user={user} />
          <button
            className="md:hidden p-1"
            onClick={toggleDrawer}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <NavLinks navItems={filteredNavItems} /> {/* Truyền filteredNavItems */}
      </div>

      {/* Drawer tự xây dựng */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Menu
            </h2>
            <button onClick={toggleDrawer} aria-label="Close menu">
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </div>
          <ul className="flex flex-col space-y-6">
            {filteredNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-lg text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                  onClick={toggleDrawer}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay khi drawer mở */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={toggleDrawer}
        />
      )}
    </nav>
  );
}

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <ImageHero />
  </Link>
);

const RightSection = ({
  isLogged,
  user,
}: {
  isLogged: boolean;
  user: User | null;
}) => (
  <div className="flex items-center space-x-3 md:space-x-5">
    <ThemeSwitcher />
    {isLogged ? (
      <Avatar user={user} />
    ) : (
      <Button
        as={Link}
        color="primary"
        className="bg-primary-500 hover:bg-primary-600 text-white"
        href="/auth/signin"
        variant="solid"
      >
        Đăng nhập
      </Button>
    )}
  </div>
);

const NavLinks = ({
  navItems,
}: {
  navItems: { href: string; label: string }[];
}) => (
  <div className="hidden md:flex md:w-auto md:order-1">
    <ul className="flex flex-col md:flex-row md:space-x-5 font-medium border border-gray-100 rounded-lg p-2 md:p-0 md:border-0 dark:border-gray-700">
      {navItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.href}
            className="py-1 px-1 text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
