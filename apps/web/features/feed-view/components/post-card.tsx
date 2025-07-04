"use client";
import { UserProfile } from "@/components/user-profile";
import { BookmarkIcon, HeartIcon, SendIcon } from "lucide-react";
import { FeedPost } from "@repo/types";
import { PollDisplay } from "./poll-display";
import { PostDisplay } from "./post-display";
import { useEffect, useRef } from "react";
import { useLogView } from "../hooks/use-log-view";
import { useLikes } from "../hooks/use-likes";
import { cn, pluralize } from "@/lib/utils";
import { CommentDialog } from "./comment-dialog";
import Link from "next/link";
import { useComments } from "../hooks/use-comments";
import { useBookmarked } from "../hooks/use-bookmarked";

export function PostCard({ post }: { post: FeedPost }) {
  const ref = useRef<HTMLDivElement>(null);
  const author = post.author;
  const { logView, isLogged } = useLogView(post.id);
  const { toggleLike } = useLikes(post.id, post.likedByMe);
  const { addComment } = useComments(post.id);
  const { bookmarked, toggleBookmark } = useBookmarked(
    post.id,
    post.bookmarkedByMe,
  );
  useEffect(() => {
    if (isLogged) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          logView();
          observer.disconnect();
        }
      },
      { threshold: 1 },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isLogged, logView]);
  return (
    <div className="flex flex-col py-2 border-b" ref={ref}>
      <div className="flex gap-2 items-center px-4">
        <UserProfile user={author} />
      </div>
      {post.postType === "regular" && <PostDisplay post={post} />}
      {post.postType === "poll" && <PollDisplay poll={post} />}
      <div className="flex mt-2 items-center px-2">
        <button
          className={cn(
            "p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer text-white hover:text-gray-200 text-sm flex",
            post.likedByMe &&
              "text-red-500 hover:bg-red-500/10 hover:text-red-500",
          )}
          onClick={() => toggleLike()}
        >
          <HeartIcon
            className={cn(
              "size-5",
              post.likedByMe && "fill-red-500 animate-pop",
            )}
          />
        </button>
        <CommentDialog
          author={post.author}
          content={post.content}
          postId={post.id}
          addComment={addComment}
        />
        <button className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <SendIcon className="size-5" />
        </button>

        <button
          className={cn(
            "text-white hover:text-gray-200 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer ml-auto",
            bookmarked &&
              "bg-primary text-primary-foreground hover:bg-primary/80",
          )}
          onClick={toggleBookmark}
        >
          <BookmarkIcon className="size-5" />
        </button>
      </div>
      <div className="flex gap-3 px-4">
        {/* TODO: Singular and plural logic for likes */}
        {post.likeCount > 0 && (
          <p className="text-gray-500 text-sm">
            {pluralize(post.likeCount, "like")}
          </p>
        )}
        <p className="text-gray-500 text-sm">
          {pluralize(post.viewCount, "view")}
        </p>
        {post.commentCount > 0 && (
          <Link
            href={`/posts/${post.id}`}
            className="text-gray-500 text-sm hover:underline cursor-pointer"
          >
            view {pluralize(post.commentCount, "comment")}
          </Link>
        )}
      </div>
    </div>
  );
}
