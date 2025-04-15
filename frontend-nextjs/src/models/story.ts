export interface Story {
  storyId: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: { genreId: number; genreName: string }[];
  chapters?: number;
  releaseDate: string;
  rating?: number;
  ratingCount?: number;
}
