import { useCallback } from "react";
import { useLikeStore } from "@/store/like-store";
import { useLikePost } from "@/features/likes/hooks/use-like-post";

export function useLikes(postId: number) {
  const setLiked = useLikeStore((state) => state.setLiked);
  const setLikeCount = useLikeStore((state) => state.setLikeCount);
  const isLiked = useLikeStore((state) => state.likedPosts[postId] ?? false);
  const likeCount = useLikeStore((state) => state.likeCounts[postId] || 0);
  const { addLike, removeLike } = useLikePost(postId);

  const setLikedState = useCallback(
    (postId: number, liked: boolean) => {
      if (liked) {
        setLikeCount(postId, likeCount + 1);
        setLiked(postId, true);
      } else {
        setLikeCount(postId, likeCount - 1);
        setLiked(postId, false);
      }
    },
    [setLiked, setLikeCount, likeCount],
  );
  const toggleLike = useCallback(() => {
    setLikedState(postId, !isLiked);
    try {
      if (!isLiked) {
        addLike();
      } else {
        removeLike();
      }
    } catch (error) {
      setLikedState(postId, isLiked);
    }
  }, [isLiked, addLike, removeLike]);

  return { toggleLike };
}
