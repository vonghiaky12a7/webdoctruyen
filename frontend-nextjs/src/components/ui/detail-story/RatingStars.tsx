/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { RatingService } from "@/services/ratingService";
import { RatingStarsProps } from "@/models/rating";
import { useAuthStore } from "@/stores/authStore";
import { addToast } from "@heroui/toast";

export default function RatingStars({
  storyId,
  userId,
  initialRating,
  ratingCount = 0,
}: RatingStarsProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(
    initialRating || null
  );
  const [totalRatings, setTotalRatings] = useState<number>(ratingCount || 0);
  const { isLogged } = useAuthStore();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (initialRating === undefined) {
          const ratingData = await RatingService.getRatingsByStoryId(storyId);
          setAverageRating(ratingData.average || 0);
          setTotalRatings(ratingData.count || 0);
        } else {
          setAverageRating(initialRating);
          setTotalRatings(ratingCount || 0);
        }

        if (isLogged && userId) {
          const userRatingData = await RatingService.getRatingsByStoryId(
            storyId
          );
          const userRating =
            userRatingData.ratings?.find((r: any) => r.userId === userId)
              ?.rating || 0;
          setRating(userRating);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu rating:", err);
      }
    };

    fetchRatings();
  }, [storyId, userId, isLogged, initialRating, ratingCount]);

  const handleRating = async (starValue: number) => {
    if (!isLogged) {
      addToast({
        description: "Bạn cần đăng nhập để thực hiện chức năng này",
        color: "danger",
        timeout: 2500,
      });
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      setRating(starValue);
      await RatingService.addRating(userId, storyId, starValue);
      const ratingData = await RatingService.getRatingsByStoryId(storyId);
      setAverageRating(ratingData.average || 0);
      setTotalRatings(ratingData.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                className={`text-2xl sm:text-3xl cursor-pointer transition-all duration-300 ${
                  starValue <= (hover || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                } hover:scale-110 hover:text-yellow-400 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            );
          })}
        </div>
        <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
          ({averageRating !== null ? averageRating.toFixed(1) : "0"}/5) -{" "}
          {totalRatings} đánh giá
        </span>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}{" "}
          {!isLogged && (
            <a href="/auth/signin" className="underline text-blue-500">
              Đăng nhập ngay
            </a>
          )}
        </p>
      )}
    </div>
  );
}
