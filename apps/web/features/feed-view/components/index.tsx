"use client";
import { LoadMoreContent } from "@/components/load-more-content";
import useFeed from "../hooks/use-feed";
import { PostCard } from "./post-card";
import { Skeleton } from "@/components/ui/skeleton";

function FeedSkeleton() {
  return (
    <div className="space-y-4 py-2 px-4 border-b">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

export default function FeedView() {
  const { feed, isLoading, loadMore } = useFeed();
  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <FeedSkeleton key={index} />
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
