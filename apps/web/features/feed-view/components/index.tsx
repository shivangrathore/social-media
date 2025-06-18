"use client";
import useFeed from "../hooks/use-feed";
import { PostCard } from "./post-card";

export default function FeedView() {
  const { feed, isLoading } = useFeed();
  console.log(feed);
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div />
      ) : (
        feed.map((entry) => (
          <PostCard key={entry.post.id} post={entry.post} author={entry.user} />
        ))
      )}
    </div>
  );
}
