"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api";
import { FeedResponse } from "@repo/api-types/feed";

export default function useFeed() {
  const { data, isLoading } = useQuery<FeedResponse>({
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
