"use client";

import { useState, useEffect } from "react";
import { ChapterService } from "@/services/chapterService";
import { ImgService } from "@/services/imgService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function AddChapterModal({
  storyId,
  storyName,
  initialChapterNumber,
  onClose,
  onSave,
}: {
  storyId: string;
  storyName: string;
  initialChapterNumber: number;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] =
    useState<number>(initialChapterNumber);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Các định dạng ảnh hợp lệ
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // Xử lý khi chọn ảnh: chỉ giữ lại file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Thu hồi các URL tạm thời cũ
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Lọc chỉ giữ lại các file ảnh
    const newFiles = Array.from(files).filter((file) =>
      validImageTypes.includes(file.type)
    );

    if (newFiles.length === 0) {
      alert("Không có file ảnh nào được chọn!");
      return;
    }

    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file)); // Tạo URL tạm thời mới

    setImageFiles(newFiles); // Ghi đè mảng file cũ
    setPreviewUrls(newPreviewUrls); // Ghi đè mảng URL tạm thời cũ
  };

  // Thu hồi URL tạm thời khi component unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Xử lý lưu: upload ảnh và tạo chapter
  const handleSave = async () => {
    if (!title || !chapterNumber) {
      alert("Vui lòng tiêu đề.");
      return;
    }
    if (imageFiles.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls = await ImgService.uploadChapterImages(
        imageFiles,
        storyName,
        chapterNumber
      );
      

      await ChapterService.createChapter(storyId, {
        title,
        chapterNumber: Number(chapterNumber),
        imageUrls: uploadedUrls,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu chương:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[700px] h-[600px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Thêm chương mới</h2>

        {/* Bố cục chia thành 2 phần */}
        <div className="flex flex-row gap-4 h-full">
          {/* Cột nhập thông tin */}
          <div className="w-1/2 flex flex-col space-y-3">
            <label className="text-sm font-medium">Số chương:</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Nhập số chương"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(Number(e.target.value))}
              disabled
            />

            <label className="text-sm font-medium">Tiêu đề chương:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Nhập tiêu đề chương"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-sm font-medium">Ảnh chương:</label>
            <input
              type="file"
              multiple
              accept="image/*" // Giới hạn hiển thị file ảnh trong file explorer
              className="w-full px-3 py-2 border rounded-md"
              onChange={handleImageChange}
              title="Chọn ảnh chương"
            />
          </div>

          {/* Cột hiển thị ảnh */}
          <div className="w-1/2 flex justify-center items-center border rounded-md overflow-hidden">
            {previewUrls.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-[300px]"
              >
                {previewUrls.map((url, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex justify-center items-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={url}
                        alt={`Preview Image ${index}`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-md"
                        priority
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-gray-500">Chưa có ảnh</p>
            )}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
