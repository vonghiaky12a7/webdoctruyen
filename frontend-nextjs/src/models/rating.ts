// src/models/rating.ts
export interface Rating {
  rating: number ;
  userId: string;
  storyId: string;
}

export interface RatingStarsProps {
  storyId: string;
  userId: string;
  initialRating?: number;
  ratingCount?: number;
}
