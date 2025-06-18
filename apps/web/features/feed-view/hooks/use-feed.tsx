"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api";
import { Post } from "@/types/post";

export default function useFeed() {
  const { data, isLoading } = useQuery<{
    data: {
      posts: Post[];
      user: User;
    };
    nextCursor: any | null;
  }>({
    queryFn: fetchFeed,
    queryKey: ["feed"],
  });

  const feed = data ? data.data : [];

  function nextPage() {}

  return {
    feed,
    nextPage,
    isLoading,
  };
}
