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
import { useLikeStore } from "@/store/like-store";
import { useCommentStore } from "@/store/comment-store";

function LikeButton({ liked, postId }: { liked: boolean; postId: number }) {
  const { toggleLike } = useLikes(postId);
  const setLiked = useLikeStore((state) => state.setLiked);
  const isLiked = useLikeStore((state) => state.likedPosts[postId] ?? false);

  useEffect(() => {
    setLiked(postId, liked);
  }, []);

  return (
    <button
      className={cn(
        "p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer text-white hover:text-gray-200 text-sm flex",
        isLiked && "text-red-500 hover:bg-red-500/10 hover:text-red-500",
      )}
      onClick={() => toggleLike()}
    >
      <HeartIcon
        className={cn("size-5", isLiked && "fill-red-500 animate-pop")}
      />
    </button>
  );
}

function LikeCount({
  postId,
  likeCount,
}: {
  postId: number;
  likeCount: number;
}) {
  const setLikeCount = useLikeStore((state) => state.setLikeCount);
  const likeCountValue = useLikeStore((state) => state.likeCounts[postId] || 0);

  useEffect(() => {
    setLikeCount(postId, likeCount);
  }, []);

  if (likeCountValue === 0) {
    return null;
  }

  return (
    <p className="text-gray-500 text-sm">{pluralize(likeCountValue, "like")}</p>
  );
}

function CommentCount({
  postId,
  commentCount,
}: {
  postId: number;
  commentCount: number;
}) {
  const setCommentCount = useCommentStore((state) => state.setCommentCount);
  const commentCountValue = useCommentStore(
    (state) => state.commentCount[postId] || 0,
  );

  useEffect(() => {
    setCommentCount(postId, commentCount);
  }, []);

  if (commentCountValue === 0) {
    return null;
  }

  return (
    <Link
      href={`/posts/${postId}`}
      className="text-gray-500 text-sm hover:underline cursor-pointer"
    >
      view {pluralize(commentCountValue, "comment")}
    </Link>
  );
}

export function PostCard({ post }: { post: FeedPost }) {
  const ref = useRef<HTMLDivElement>(null);
  const author = post.author;
  const { logView, isLogged } = useLogView(post.id);
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
      <div className="flex gap-2 items-center">
        <UserProfile user={author} />
      </div>
      {post.postType === "regular" && <PostDisplay post={post} />}
      {post.postType === "poll" && <PollDisplay poll={post} />}
      <div className="flex mt-2 items-center">
        <LikeButton postId={post.id} liked={post.likedByMe} />
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
      <div className="flex gap-3">
        <LikeCount postId={post.id} likeCount={post.likeCount} />
        <p className="text-gray-500 text-sm">
          {pluralize(post.viewCount, "view")}
        </p>
        <CommentCount postId={post.id} commentCount={post.commentCount} />
      </div>
    </div>
  );
}
