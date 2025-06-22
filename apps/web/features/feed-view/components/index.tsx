"use client";
import { LoadMoreContent } from "@/components/load-more-content";
import useFeed from "../hooks/use-feed";
import { PostCard } from "./post-card";

export default function FeedView() {
  const { feed, isLoading, loadMore } = useFeed();
  return (
    <div className="space-y-4">
      {isLoading
        ? null
        : feed.map((post) => <PostCard key={post.id} post={post} />)}
      <LoadMoreContent isLoading={isLoading} loadMore={loadMore} />
    </div>
  );
}
