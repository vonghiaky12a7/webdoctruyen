import Link from "next/link";
import { Chapter } from "@/models/chapter";

interface ChapterListProps {
  storyId: string;
  chapters: Chapter[];
}

export default function ChapterList({ storyId, chapters }: ChapterListProps) {
  return (
    <div className="bg-white p-6 border rounded-2xl shadow-xl dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        📖 Danh sách chương
      </h2>
      {chapters.length > 0 ? (
        <ul className="divide-y divide-gray-200 max-h-[400px]">
          {chapters.map((chapter) => (
            <li
              key={chapter.chapterId}
              className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-300 px-4 rounded-lg transition-all duration-200"
            >
              <Link
                href={`/stories/${storyId}/chapter/${chapter.chapterId}`}
                className="text-blue-600 font-medium hover:underline text-base truncate dark:text-blue-400"
              >
                {`Chương ${chapter.chapterNumber}: ${chapter.title}`}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4 text-base">
          Chưa có chương nào được thêm.
        </p>
      )}
    </div>
  );
}
