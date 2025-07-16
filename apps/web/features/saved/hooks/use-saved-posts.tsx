"use client";

import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "../api";

export function useSavedPosts() {
  const { isLoading, data } = useQuery({
    queryKey: ["feed:saved"],
    queryFn: getSavedPosts,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    savedPosts: data ? data.data : [],
  };
}
