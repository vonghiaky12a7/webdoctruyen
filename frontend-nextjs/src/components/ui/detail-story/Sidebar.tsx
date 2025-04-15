import { useState } from "react";
import StoryList from "./StoryList";
import CommentSection from "./CommentSection";
import { Story } from "@/models/story";
import { Comment } from "@/models/comment";

interface SidebarProps {
  newestStories: Story[];
  topStories: Story[];
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  storyId: string | undefined;
  userId: string | null;
}

export default function Sidebar({
  newestStories,
  topStories,
  comments,
  setComments,
  storyId,
  userId,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"newest" | "top">("newest");

  return (
    <div className="flex flex-col space-y-6">
      <StoryList
        newestStories={newestStories}
        topStories={topStories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <CommentSection
        comments={comments}
        setComments={setComments}
        storyId={storyId}
        userId={userId}
      />
    </div>
  );
}
