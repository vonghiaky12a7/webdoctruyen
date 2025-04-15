export interface Chapter {
  chapterId: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  imageUrls: string[];
  createdAt: Date | string;
}
