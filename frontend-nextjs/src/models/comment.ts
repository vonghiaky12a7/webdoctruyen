// models/comment.ts
export interface Comment {
  id: string;
  userId: string;
  storyId: string;
  content: string;
  created_at?: string;
  user?: {
    username: string;
    avatarPath: string;
  };
}
