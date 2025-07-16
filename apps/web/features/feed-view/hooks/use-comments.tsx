"use client";

import { useCallback } from "react";
import { useCreateComment } from "@/features/comments/hooks/use-create-comment";
import { useQueryClient } from "@tanstack/react-query";
import { GetFeedResponse } from "@repo/types";

export function useComments(postId: number, query: string = "feed") {
  const { create } = useCreateComment({ postId });
  const queryClient = useQueryClient();

  const addComment = useCallback(
    async (content: string) => {
      const previousFeed = queryClient.getQueryData<GetFeedResponse>([query]);
      queryClient.setQueryData([query], (old: GetFeedResponse) => {
        if (!old) return old;
        const updatedFeed = {
          ...old,
          data: old.data.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                commentCount: post.commentCount + 1,
              };
            }
            return post;
          }),
        };
        return updatedFeed;
      });
      try {
        await create(content);
      } catch (error) {
        console.error("Error adding comment:", error);
        queryClient.setQueryData([query], () => {
          return previousFeed;
        });
      }
    },
    [create],
  );

  return { addComment };
}
