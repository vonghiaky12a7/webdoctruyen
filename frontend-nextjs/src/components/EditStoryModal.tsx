import { useState } from "react";
import { StoryService } from "@/services/storyService";
import { Story } from "@/models/story";
import { ImgService } from "@/services/imgService";

interface EditStoryModalProps {
  story: Story;
  onClose: () => void;
  onSave: () => void;
}

export default function EditStoryModal({
  story,
  onClose,
  onSave,
}: EditStoryModalProps) {
  const [formData, setFormData] = useState<Omit<Story, "storyId">>({
    title: story.title,
    author: story.author,
    description: story.description,
    coverImage: story.coverImage,
    genreIds: [...story.genreIds],
    releaseDate: new Date().toISOString().split("T")[0], // Ngày hiện tại (YYYY-MM-DD)
  });

  const [previewImage, setPreviewImage] = useState<string>(story.coverImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleGenreChange(e: React.ChangeEvent<HTMLInputElement>) {
    const genreId = Number(e.target.value);
    setFormData((prev) => ({
      ...prev,
      genreIds: e.target.checked
        ? [...prev.genreIds, genreId]
        : prev.genreIds.filter((id) => id !== genreId),
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let coverImageUrl = formData.coverImage;

      if (imageFile) {
        coverImageUrl = await ImgService.uploadStoryBackground(
          imageFile,
          formData.title
        );
      }

      await StoryService.updateStory(story.storyId, {
        ...formData,
        coverImage: coverImageUrl,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating story:", error);
      setError("Có lỗi xảy ra khi cập nhật truyện");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-start mt-4 mb-4">
        {/* Ảnh bìa */}
        <div className="w-1/3 flex flex-col items-center">
          <img
            src={previewImage}
            alt="Ảnh truyện"
            className="w-32 h-48 rounded-md object-cover shadow-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 text-sm"
          />
        </div>

        {/* Nội dung bên phải */}
        <div className="w-2/3 pl-4">
          <h2 className="text-xl font-bold mb-3">Chỉnh sửa truyện</h2>

          {/* Tên truyện */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Tên truyện"
          />

          {/* Tác giả */}
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Tác giả"
          />

          {/* Mô tả */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Mô tả truyện"
          ></textarea>

          {/* Thể loại */}
          <div className="mb-2">
            <p className="font-semibold mb-1">Thể loại:</p>
            {[
              { id: 1, name: "Hành động" },
              { id: 2, name: "Phiêu lưu" },
              { id: 3, name: "Lãng mạn" },
              { id: 4, name: "Kinh dị" },
            ].map((genre) => (
              <label key={genre.id} className="inline-flex items-center mr-3">
                <input
                  type="checkbox"
                  value={genre.id}
                  checked={formData.genreIds.includes(genre.id)}
                  onChange={handleGenreChange}
                  className="mr-1"
                />
                {genre.name}
              </label>
            ))}
          </div>

          {/* Nút Lưu và Hủy */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Hủy
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
