"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createDraftPost, getDraftPost } from "../api/posts";
import { Post } from "@repo/types";

export function usePostDraft() {
  const {
    data: draft,
    isLoading,
    error,
    refetch,
  } = useQuery<Post>({
    queryKey: ["postDraft"],
    queryFn: getDraftPost,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutateAsync: create } = useMutation({
    mutationKey: ["createDraftPost"],
    mutationFn: createDraftPost,
    onSuccess: () => {
      refetch();
    },
  });

  return {
    draft,
    isLoading,
    error,
    refetch,
    create,
  };
}
