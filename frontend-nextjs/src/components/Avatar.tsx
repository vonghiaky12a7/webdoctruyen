/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Avatar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { DEFAULT_AVATAR } from "@/constants/images";
import { addToast } from "@heroui/react";

import { User } from "@/models/user";

interface AvatarProps {
  user: User | null; // Có thể thay bằng kiểu User nếu đã định nghĩa
}


export default function Avatar({ user }: AvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore(); // Vẫn cần logout từ useAuthStore
  const router = useRouter();

  const handleLogout = () => {
    try {
      logout();
      setIsOpen(false);
      addToast({
        title: "Success",
        description: "Đăng xuất thành công",
        color: "success",
        timeout: 2500,
      });
      router.push("/");
    } catch (error: any) {
      console.error("Logout failed:", error);
      addToast({
        title: "Success",
        description: "Đăng xuất thất bại" +
          (error.response?.data?.message || "Lỗi không xác định"),
        color: "success",
        timeout: 2500,
      });
    }
  };

  const profileLink = user ? `/profile` : "/profile";

  return (
    <div className="relative z-50">
      <AvatarImage
        src={user?.avatarPath || DEFAULT_AVATAR}
        alt={user?.username || "User"}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <DropdownMenu
          username={user?.username}
          email={user?.email}
          profileLink={profileLink}
          onClose={() => setIsOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

// Tách Avatar Image
const AvatarImage = ({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) => (
  <div
    id="avatarButton"
    onClick={onClick}
    className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-600"
  >
    <Image
      src={src}
      alt={`${alt}'s avatar`}
      width={40}
      height={40}
      className="object-cover w-full h-full"
      priority
      onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
    />
  </div>
);

// Tách Dropdown Menu
const DropdownMenu = ({
  username,
  email,
  profileLink,
  onClose,
  onLogout,
}: {
  username?: string;
  email?: string;
  profileLink: string;
  onClose: () => void;
  onLogout: () => void;
}) => (
  <div className="absolute right-0 z-50 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600">
    <UserInfo username={username} email={email} />
    <MenuItems
      profileLink={profileLink}
      onClose={onClose}
      onLogout={onLogout}
    />
  </div>
);

// Tách User Info
const UserInfo = ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) => (
  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
    <div className="font-medium">{username || "User"}</div>
    <div className="truncate text-gray-500 dark:text-gray-400">{email}</div>
  </div>
);

// Tách Menu Items
const MenuItems = ({
  profileLink,
  onClose,
  onLogout,
}: {
  profileLink: string;
  onClose: () => void;
  onLogout: () => void;
}) => (
  <>
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
      <li>
        <Link
          href={profileLink}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
          onClick={onClose}
        >
          Profile
        </Link>
      </li>
      <li>
        <Link
          href="/settings"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
          onClick={onClose}
        >
          Settings
        </Link>
      </li>
    </ul>
    <div className="py-1">
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
      >
        Sign out
      </button>
    </div>
  </>
);
