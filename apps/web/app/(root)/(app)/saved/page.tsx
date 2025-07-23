"use client";

import { LoadMoreContent } from "@/components/load-more-content";
import { SuggestionPanel } from "@/components/suggestion-panel";
import { PostCard } from "@/features/feed-view/components/post-card";
import { PostSkeleton } from "@/features/feed-view/components/post-skeleton";
import { useSavedPosts } from "@/features/saved/hooks/use-saved-posts";

export default function SavedPage() {
  const { isLoading, savedPosts, fetchNextPage } = useSavedPosts();

  return (
    <div className="flex gap-36">
      <div className="max-w-lg my-4 ml-20 w-[600px]">
        <h1 className="text-2xl font-bold mb-4">Saved Posts</h1>
        <p className="text-gray-600 mb-4">
          Here you can find all the posts you have saved.
        </p>
        {isLoading ? (
          <PostSkeleton />
        ) : (
          <>
            {savedPosts.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
            <LoadMoreContent isLoading={isLoading} loadMore={fetchNextPage} />
          </>
        )}
        {!isLoading && savedPosts.length === 0 && (
          <p className="text-gray-500 py-4">
            You have not saved any posts yet.
          </p>
        )}
      </div>
      <SuggestionPanel />
    </div>
  );
}
