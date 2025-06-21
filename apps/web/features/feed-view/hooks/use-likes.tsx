import { useMutation } from "@tanstack/react-query";
import { postAddLike, postRemoveLike } from "../api/likes";
import { useCallback, useState } from "react";

export function useLikes(postId: number, liked: boolean, likes: number) {
  const [hasLiked, setHasLiked] = useState(liked);
  const [numLikes, setNumLikes] = useState(likes);
  const { mutateAsync: addLike } = useMutation({
    mutationFn: async () => postAddLike(postId),
    mutationKey: ["addLike", postId],
    onMutate: () => {
      setHasLiked(true);
      setNumLikes((prev) => prev + 1);
    },
    onError: () => {
      setHasLiked(false);
      setNumLikes((prev) => prev - 1);
    },
  });

  const { mutateAsync: removeLike } = useMutation({
    mutationFn: async () => postRemoveLike(postId),
    mutationKey: ["removeLike", postId],
    onMutate: () => {
      setHasLiked(false);
      setNumLikes((prev) => prev - 1);
    },
    onError: () => {
      setHasLiked(true);
      setNumLikes((prev) => prev + 1);
    },
  });

  const toggleLike = useCallback(() => {
    if (hasLiked) {
      removeLike();
    } else {
      addLike();
    }
  }, [hasLiked, addLike, removeLike]);

  return { hasLiked, toggleLike, numLikes };
}
