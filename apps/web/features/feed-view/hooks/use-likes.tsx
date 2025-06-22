import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAddLike, postRemoveLike } from "../api/likes";
import { useCallback } from "react";
import { FeedResponse } from "@repo/api-types/feed";

export function useLikes(postId: number, liked: boolean) {
  const queryClient = useQueryClient();
  function markLiked(liked: boolean) {
    queryClient.setQueryData(["feed"], (old: FeedResponse) => {
      if (!old) return old;
      const incr = liked ? 1 : -1;
      const updatedFeed = {
        ...old,
        data: old.data.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.likes + incr,
              liked: liked,
            };
          }
          return post;
        }),
      };
      return updatedFeed;
    });
  }
  const { mutateAsync: addLike } = useMutation({
    mutationFn: async () => postAddLike(postId),
    mutationKey: ["addLike", postId],
    onMutate: () => {
      markLiked(true);
    },
    onError: () => {
      markLiked(false);
    },
  });

  const { mutateAsync: removeLike } = useMutation({
    mutationFn: async () => postRemoveLike(postId),
    mutationKey: ["removeLike", postId],
    onMutate: () => {
      markLiked(false);
    },
    onError: () => {
      markLiked(true);
    },
  });

  const toggleLike = useCallback(() => {
    if (liked) {
      removeLike();
    } else {
      addLike();
    }
  }, [liked, addLike, removeLike]);

  return { toggleLike };
}
