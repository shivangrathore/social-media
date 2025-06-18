"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api";
import { GetPostsResponse } from "@repo/api-types/post";

export default function useFeed() {
  const { data, isLoading } = useQuery<GetPostsResponse>({
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
