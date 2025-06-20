"use client";
import useFeed from "../hooks/use-feed";
import { PostCard } from "./post-card";

export default function FeedView() {
  const { feed, isLoading } = useFeed();
  return (
    <div className="space-y-4">
      {isLoading
        ? null
        : feed.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
