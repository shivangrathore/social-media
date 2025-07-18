"use client";

import { useMutation } from "@tanstack/react-query";
import { postAddLike, postRemoveLike } from "../api";

export function useLikePost(postId: number) {
  const { mutateAsync: addLike } = useMutation({
    mutationFn: () => postAddLike(postId),
  });
  const { mutateAsync: removeLike } = useMutation({
    mutationFn: () => postRemoveLike(postId),
  });

  return { addLike, removeLike };
}
