import { FeedEntry } from "@repo/api-types/feed";
import PostAttachmentGrid from "./post-attachment-grid";

type Post = Extract<FeedEntry, { postType: "regular" }>;
export function PostDisplay({ post }: { post: Post }) {
  return (
    <>
      {post.content && (
        <div className="p-4">
          <p>{post.content}</p>
        </div>
      )}
      {post.attachments.length > 0 && (
        <PostAttachmentGrid attachments={post.attachments} />
      )}
    </>
  );
}
