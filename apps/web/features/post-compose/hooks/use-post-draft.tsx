"use client";
import { useQuery } from "@tanstack/react-query";
import { createDraftPost } from "../api/posts";
import { CreateDraftPostResponse } from "@repo/api-types/post";

export function usePostDraft() {
  const {
    data: draft,
    isLoading,
    error,
    refetch,
  } = useQuery<CreateDraftPostResponse>({
    queryKey: ["postDraft"],
    queryFn: createDraftPost,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    draft,
    isLoading,
    error,
    refetch,
  };
}
