"use client";

import { useEffect, useState } from "react";
import { Chapter } from "@/models/chapter";
import { ChapterService } from "@/services/chapterService";
import { ImgService } from "@/services/imgService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function EditChapterModal({
  storyName,
  chapter,
  onClose,
  onSave,
}: {
  storyName: string;
  chapter: Chapter;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(chapter.title);
  const [chapterNumber, setChapterNumber] = useState<number | "">(
    chapter.chapterNumber
  );
  const [imageUrls] = useState<string[]>(
    Array.isArray(chapter.imageUrls) ? chapter.imageUrls : []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);
  

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
  
    // Thu hồi các URL tạm thời cũ
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  
    const newFiles = Array.from(files).filter((file) =>
      validImageTypes.includes(file.type)
    );
  
    if (newFiles.length === 0) {
      alert("Không có file ảnh hợp lệ nào được chọn!");
      return;
    }
  
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
  
    setImageFiles(newFiles); // Ghi đè mảng file cũ
    setPreviewUrls(newPreviewUrls); // Ghi đè mảng URL tạm thời cũ
  }
  
  

  async function handleSave() {
    if (!title || !chapterNumber) {
      alert("Vui lòng nhập số chương và tiêu đề.");
      return;
    }
  
    setLoading(true);
    try {

      for (const imageUrl of imageUrls) {
        await ImgService.deleteImage(imageUrl);
      }
      
      const updatedImageUrls = await ImgService.uploadChapterImages(
        imageFiles,
        storyName,
        chapter.chapterNumber
      );

      // Cập nhật chương với danh sách ảnh mới
      await ChapterService.updateChapter(chapter.storyId, chapter.chapterId, {
        title,
        chapterNumber: Number(chapterNumber),
        imageUrls: updatedImageUrls,
      });
  
      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật chương:", error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[700px] h-[600px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa chương</h2>

        <div className="flex flex-row gap-4 h-full">
          <div className="w-1/2 flex flex-col space-y-3">
            <label className="text-sm font-medium">Số chương:</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Nhập số chương"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(Number(e.target.value))}
              disabled // Không cho phép chỉnh sửa số chương
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
              className="w-full px-3 py-2 border rounded-md"
              onChange={handleImageUpload}
              title="Chọn ảnh chương"
              placeholder="Chọn ảnh chương"
            />
          </div>

          <div className="w-1/2 flex justify-center items-center border rounded-md overflow-hidden">
          {(previewUrls.length > 0 ? previewUrls : imageUrls).length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-[300px]"
              >
                {(previewUrls.length > 0 ? previewUrls : imageUrls).map((url, index) => (
                  <SwiperSlide key={index} className="flex justify-center items-center">
                    <img
                      src={url}
                      alt={`Chapter Image ${index}`}
                      className="max-w-full max-h-full object-contain rounded-md"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-gray-500">Chưa có ảnh</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={onClose}>
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