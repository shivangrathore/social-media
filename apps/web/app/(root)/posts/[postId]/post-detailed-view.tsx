"use client";

import { UserProfile } from "@/components/user-profile";
import { useComments } from "@/features/comments/hooks/use-comments";
import { PostCard } from "@/features/feed-view/components/post-card";
import { RichContent } from "@/features/feed-view/components/rich-content";
import { FeedPost } from "@repo/types";

export function PostDetailedView({ post }: { post: FeedPost }) {
  const { comments } = useComments(post.id);
  return (
    <div className="flex flex-col w-[600px] max-w-full">
      <PostCard post={post} />
      <div className="">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-col items-start gap-2 p-2 border-b"
          >
            <UserProfile user={comment.user} />
            <RichContent content={comment.content} />
          </div>
        ))}
      </div>
    </div>
  );
}
