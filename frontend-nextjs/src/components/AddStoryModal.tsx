// components/AddStoryModal.tsx
import { useState, useEffect } from "react";
import { StoryService } from "@/services/storyService";
import { ImgService } from "@/services/imgService"; // Import ImgService
import { Story } from "@/models/story";
import { Genre } from "@/models/genre";
import { GenreService } from "@/services/genreService";
import Image from "next/image";

interface AddStoryModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function AddStoryModal({ onClose, onSave }: AddStoryModalProps) {
  const [formData, setFormData] = useState<Omit<Story, "storyId">>({
    title: "",
    author: "",
    description: "",
    coverImage: "",
    genreIds: [],
    releaseDate: new Date().toISOString().split("T")[0],
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null); // Thêm state để lưu file
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchGenres = async () => {
      try {
        setLoading(true);
        const genresData = await GenreService.getGenres();
        if (isMounted) {
          setGenres(genresData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching genres:", err);
          setError("Không thể tải danh sách thể loại");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGenres();

    return () => {
      isMounted = false;
    };
  }, []);

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
      setImageFile(file); // Lưu file gốc
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let coverImageUrl = "";

      // Upload ảnh bìa nếu có
      if (imageFile) {
        coverImageUrl = await ImgService.uploadStoryBackground(
          imageFile,
          formData.title
        );
      }

      await StoryService.createStory({
        ...formData,
        coverImage: coverImageUrl,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Error creating story:", error);
      setError("Có lỗi xảy ra khi tạo truyện mới");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-start mt-4 mb-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="w-1/3 flex flex-col items-center">
          <div className="relative w-32 h-48">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Ảnh truyện"
                fill
                className="rounded-md object-cover shadow-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border rounded-md bg-gray-100">
                Chưa có ảnh
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 text-sm"
          />
        </div>

        <div className="w-2/3 pl-4">
          <h2 className="text-xl font-bold mb-3">Thêm truyện mới</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2 rounded"
              placeholder="Tên truyện"
            />

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2 rounded"
              placeholder="Tác giả"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2 rounded"
              placeholder="Mô tả truyện"
              rows={4}
            ></textarea>

            <div className="mb-2">
              <p className="font-semibold mb-1">Thể loại:</p>
              {loading ? (
                <p className="text-gray-500">Đang tải thể loại...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {genres.map((genre) => (
                    <label
                      key={genre.genreId}
                      className="inline-flex items-center mr-3"
                    >
                      <input
                        type="checkbox"
                        value={genre.genreId}
                        checked={formData.genreIds.includes(genre.genreId)}
                        onChange={handleGenreChange}
                        className="mr-1"
                      />
                      {genre.genreName}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang thêm..." : "Thêm"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
