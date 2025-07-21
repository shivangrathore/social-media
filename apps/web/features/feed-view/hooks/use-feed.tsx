"use client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api";
import { GetFeedResponse } from "@repo/types";

export default function useFeed() {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery<
    GetFeedResponse,
    Error,
    InfiniteData<GetFeedResponse>,
    string[],
    number | null
  >({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
    initialPageParam: null,
  });

  return {
    feed: data?.pages.flatMap((page) => page.data) || [],
    loadMore: fetchNextPage,
    isLoading,
  };
}
