"use client";
import { LoadMoreContent } from "@/components/load-more-content";
import useFeed from "../hooks/use-feed";
import { PostCard } from "./post-card";
import { PostSkeleton } from "./post-skeleton";

export default function FeedView() {
  const { feed, isLoading, loadMore } = useFeed();
  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        : feed.map((post) => <PostCard key={post.id} post={post} />)}
      {!isLoading && feed.length === 0 && (
        <div className="text-center text-sm">
          It's empty out here, why don't you post something?
        </div>
      )}
      <LoadMoreContent isLoading={isLoading} loadMore={loadMore} />
    </div>
  );
}
