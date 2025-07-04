"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api";
import { GetFeedResponse } from "@repo/types";

export default function useFeed() {
  const { data, isLoading } = useQuery<GetFeedResponse>({
    queryFn: fetchFeed,
    queryKey: ["feed"],
  });

  const feed = data ? data.data : [];

  function loadMore() {}

  return {
    feed,
    loadMore,
    isLoading,
  };
}
