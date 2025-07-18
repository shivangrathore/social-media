"use client";

import { useCallback } from "react";
import { useCreateComment } from "@/features/comments/hooks/use-create-comment";
import { useCommentStore } from "@/store/comment-store";

export function useComments(postId: number) {
  const { create } = useCreateComment({ postId });
  const commentCount = useCommentStore(
    (state) => state.commentCount[postId] || 0,
  );
  const setCommentCount = useCommentStore((state) => state.setCommentCount);

  const addComment = useCallback(
    async (content: string) => {
      setCommentCount(postId, commentCount + 1);
      try {
        await create(content);
      } catch (error) {
        console.error("Error adding comment:", error);
        setCommentCount(postId, commentCount);
      }
    },
    [create, postId, commentCount, setCommentCount],
  );

  return { addComment };
}
