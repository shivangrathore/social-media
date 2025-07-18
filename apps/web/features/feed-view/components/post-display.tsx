import { FeedPost } from "@repo/types";
import PostAttachmentGrid from "./post-attachment-grid";
import { cn } from "@/lib/utils";
import { RichPostContent } from "./rich-post-content";

type Post = Extract<FeedPost, { postType: "regular" }>;
export function PostDisplay({ post }: { post: Post }) {
  return (
    <>
      {post.content && (
        <RichPostContent content={post.content} className="mt-2 text-sm" />
      )}
      {post.attachments.length > 0 && (
        <PostAttachmentGrid
          attachments={post.attachments}
          className={cn("mt-2")}
        />
      )}
    </>
  );
}
