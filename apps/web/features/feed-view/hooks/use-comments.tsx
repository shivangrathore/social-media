"use client";

import { useCallback } from "react";
import { useCreateComment } from "@/features/comments/hooks/use-create-comment";
import { useQueryClient } from "@tanstack/react-query";
import { FeedResponse } from "@repo/api-types/feed";

export function useComments(postId: number) {
  const { create } = useCreateComment({ postId });
  const queryClient = useQueryClient();

  const addComment = useCallback(
    async (content: string) => {
      const previousFeed = queryClient.getQueryData<FeedResponse>(["feed"]);
      // TODO: Relook at this, it might not be the best way to update the feed
      queryClient.setQueryData(["feed"], (old: FeedResponse) => {
        if (!old) return old;
        const updatedFeed = {
          ...old,
          data: old.data.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments + 1,
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
        queryClient.setQueryData(["feed"], () => {
          return previousFeed;
        });
      }
    },
    [create],
  );

  return { addComment };
}
