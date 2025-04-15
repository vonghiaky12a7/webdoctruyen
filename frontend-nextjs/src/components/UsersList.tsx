"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
  hashedPassword: string;
  avatarPath?: string | null;
  isPassword: boolean;
  roleId: number;
}

const roleMap: { [key: number]: string } = {
  1: "Admin",
  2: "Editor",
  3: "Reader",
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8092/users", { withCredentials: true }) // Thêm withCredentials
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:lg">
      {/* Table */}
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
              key={user._id}
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
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    N/A
                  </div>
                )}
                <div className="pl-3">
                  <div className="text-base font-semibold">{user.username}</div>
                </div>
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{roleMap[user.roleId] || "Unknown"}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => router.push(`profile/edit-user/${user._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit user
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
