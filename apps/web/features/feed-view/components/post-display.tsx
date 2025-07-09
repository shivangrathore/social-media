import { FeedPost } from "@repo/types";
import PostAttachmentGrid from "./post-attachment-grid";
import { cn } from "@/lib/utils";

type Post = Extract<FeedPost, { postType: "regular" }>;
export function PostDisplay({ post }: { post: Post }) {
  return (
    <>
      {post.content && (
        <div className="px-4 mt-2 text-sm">
          <p>{post.content}</p>
        </div>
      )}
      {post.attachments.length > 0 && (
        <PostAttachmentGrid
          attachments={post.attachments}
          className={cn(post.content && "mt-2")}
        />
      )}
    </>
  );
}
