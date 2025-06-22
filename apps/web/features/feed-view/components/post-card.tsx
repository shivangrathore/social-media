"use client";
import { UserProfile } from "@/components/user-profile";
import { BookmarkIcon, HeartIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedEntry } from "@repo/api-types/feed";
import { PollDisplay } from "./poll-display";
import { PostDisplay } from "./post-display";
import { useEffect, useRef } from "react";
import { useLogView } from "../hooks/use-log-view";
import { useLikes } from "../hooks/use-likes";
import { cn, pluralize } from "@/lib/utils";
import { CommentDialog } from "./comment-dialog";
import Link from "next/link";
import { useComments } from "../hooks/use-comments";

export function PostCard({ post }: { post: FeedEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const author = post.author;
  const { logView, isLogged } = useLogView(post.id);
  const { toggleLike } = useLikes(post.id, post.liked);
  const { addComment } = useComments(post.id);
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
    <div
      className="border border-border rounded-md bg-background flex flex-col py-2"
      ref={ref}
    >
      <div className="flex gap-2 items-center border-b p-2 px-4">
        <UserProfile {...author} />
      </div>
      {post.postType === "regular" && <PostDisplay post={post} />}
      {post.postType === "poll" && <PollDisplay poll={post} />}
      <hr className="my-2 mt-0" />
      <div className="flex px-4 items-center">
        <button
          className={cn(
            "p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer text-gray-400 text-sm flex",
            post.liked && "text-red-500 hover:bg-red-500/10 dark:text-red-500",
          )}
          onClick={() => toggleLike()}
        >
          <HeartIcon
            className={cn("size-5", post.liked && "fill-red-500 animate-pop")}
          />
        </button>
        <CommentDialog
          author={post.author}
          content={post.postType == "regular" ? post.content : post.question}
          postId={post.id}
          addComment={addComment}
        />
        <button className="text-gray-400 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <SendIcon className="size-5" />
        </button>

        <Button variant="secondary" className="ml-auto">
          <BookmarkIcon className="size-5" />
        </Button>
      </div>
      <hr className="my-2" />
      <div className="flex gap-3 px-4">
        {/* TODO: Singular and plural logic for likes */}
        {post.likes > 0 && (
          <p className="text-gray-500 text-sm">
            {pluralize(post.likes, "like")}
          </p>
        )}
        <p className="text-gray-500 text-sm">{pluralize(post.views, "view")}</p>
        {post.comments > 0 && (
          <Link
            href={`/posts/${post.id}`}
            className="text-gray-500 text-sm hover:underline cursor-pointer"
          >
            {pluralize(post.comments, "comment")}
          </Link>
        )}
      </div>
    </div>
  );
}
