/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { userService } from "@/services/userService";
import { addToast } from "@heroui/react";
import { User } from "@/models/user";

const roleMap: { [key: number]: string } = {
  1: "Admin",
  2: "Writer",
  3: "Reader",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await userService.getUsers();

      // Filter out the current user (we'll get the current user from auth store)
      const currentUser = JSON.parse(
        localStorage.getItem("auth-storage") || "{}"
      )?.state?.user;
      const filteredUsers = userData.filter(
        (user) => user.id !== currentUser?.id
      );

      setUsers(filteredUsers);
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      setError(
        error.response?.status === 401
          ? "Bạn chưa đăng nhập hoặc không có quyền truy cập!"
          : "Lỗi khi tải danh sách người dùng!"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(userId);

        addToast({
          title: "Thành công",
          description: "Người dùng đã bị xóa!",
          color: "success",
          timeout: 3000,
        });

        fetchUsers(); // Refresh the list
      } catch (error: any) {
        console.error("Lỗi khi xóa người dùng:", error);

        addToast({
          title: "Lỗi",
          description:
            error.response?.data?.message || "Xóa thất bại, vui lòng thử lại!",
          color: "danger",
          timeout: 3000,
        });
      }
    }
  };

  const handleRoleChange = async (userId: string, newRoleId: number) => {
    try {
      await userService.updateUserRole(userId, newRoleId);

      // Update the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, roleId: newRoleId } : user
        )
      );

      addToast({
        title: "Thành công",
        description: "Đã cập nhật vai trò người dùng!",
        color: "success",
        timeout: 2000,
      });
    } catch (error: any) {
      console.error("Lỗi khi cập nhật vai trò:", error);

      addToast({
        title: "Lỗi",
        description: error.response?.data?.message || "Cập nhật thất bại!",
        color: "danger",
        timeout: 3000,
      });
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                {user.avatarPath ? (
                  <Image
                    className="w-10 h-10 rounded-full"
                    src={user.avatarPath}
                    alt={user.username}
                    width={40}
                    height={40}
                    priority
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    N/A
                  </div>
                )}
                <div className="pl-3">
                  <div className="text-base font-semibold">{user.username}</div>
                </div>
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <label htmlFor={`role-${user.id}`} className="sr-only">
                  Select user role
                </label>
                <select
                  id={`role-${user.id}`}
                  value={user.roleId}
                  onChange={(e) =>
                    handleRoleChange(user.id, Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700"
                  aria-label="Select user role"
                >
                  {Object.entries(roleMap).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline"
                >
                  Xóa người dùng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
