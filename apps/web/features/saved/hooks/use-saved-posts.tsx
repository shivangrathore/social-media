"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getSavedPosts } from "../api";
import { GetFeedResponse } from "@repo/types";

export function useSavedPosts() {
  const { isLoading, data, fetchNextPage } = useInfiniteQuery<
    GetFeedResponse,
    Error,
    InfiniteData<GetFeedResponse>,
    string[],
    number | null
  >({
    queryKey: ["feed:saved"],
    queryFn: ({ pageParam }) => getSavedPosts(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  });

  return {
    isLoading,
    savedPosts: data?.pages.flatMap((page) => page.data) || [],
    fetchNextPage,
  };
}
