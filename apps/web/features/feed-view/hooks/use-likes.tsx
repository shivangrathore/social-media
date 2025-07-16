import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAddLike, postRemoveLike } from "../api/likes";
import { useCallback } from "react";
import { FeedPost, GetFeedResponse } from "@repo/types";

export function useLikes(
  postId: number,
  likedByMe: boolean,
  query: string = "feed",
) {
  const queryClient = useQueryClient();
  function markLiked(likedByMe: boolean) {
    queryClient.setQueryData([query], (old: GetFeedResponse) => {
      if (!old) return old;
      const incr = likedByMe ? 1 : -1;
      const updatedFeed = {
        ...old,
        data: old.data.map((post: FeedPost) => {
          if (post.id === postId) {
            return {
              ...post,
              likedByMe,
              likeCount: post.likeCount + incr,
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
    if (likedByMe) {
      removeLike();
    } else {
      addLike();
    }
  }, [likedByMe, addLike, removeLike]);

  return { toggleLike };
}
