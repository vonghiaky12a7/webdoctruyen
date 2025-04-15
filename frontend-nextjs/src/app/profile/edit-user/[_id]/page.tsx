"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function EditUser() {
  const router = useRouter();
  const { _id } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    roleId: 3,
    avatarPath: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!_id) return;
    axios
      .get(`http://localhost:8092/users/${_id}`, { withCredentials: true }) // Thêm withCredentials
      .then((response) => {
        setUser(response.data);
        setPreview(response.data.avatarPath || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError("Không tìm thấy người dùng.");
        setLoading(false);
      });
  }, [_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let avatarUrl = user.avatarPath;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile); // Thêm file vào formData

        try {
          // Gửi file lên route upload
          const uploadRes = await axios.post(
            "http://localhost:8092/users/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true, // Thêm withCredentials
            }
          );
          avatarUrl = uploadRes.data.url; // Cập nhật URL ảnh nếu tải lên thành công
        } catch (uploadError) {
          console.error("Lỗi tải ảnh lên:", uploadError);
          alert("Không thể tải ảnh lên! Vui lòng thử lại.");
          return; // Ngừng cập nhật nếu lỗi tải ảnh
        }
      }

      // Cập nhật thông tin người dùng
      await axios.put(
        `http://localhost:8092/users/${_id}`,
        {
          ...user,
          avatarPath: avatarUrl, // Cập nhật avatarPath
        },
        { withCredentials: true }
      ); // Thêm withCredentials

      alert("Cập nhật thành công!");
      router.push(`/profile/${_id}`); // Quay lại trang chính
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      alert("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Đang tải...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 dark:text-red-400">{error}</p>
    );

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-100 dark:bg-gray-800 p-6 shadow-md rounded-lg transition duration-300">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        Chỉnh sửa người dùng
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hiển thị ảnh đại diện */}
        <div className="flex flex-col items-center">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              N/A
            </div>
          )}
        </div>

        {/* Upload ảnh mới */}
        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Ảnh đại diện:
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Tên người dùng:
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
            required
            placeholder="Nhập tên người dùng"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition duration-300"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
