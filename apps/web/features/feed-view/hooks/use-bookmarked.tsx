import { useCallback } from "react";
import { bookmarkPost, unbookmarkPost } from "../api";
import { useBookmarkStore } from "@/store/bookmark-store";

export function useBookmarked(postId: number) {
  const bookmarked = useBookmarkStore(
    (state) => state.bookmarkedPosts[postId] ?? false,
  );
  const setBookmarked = useBookmarkStore((state) => state.setBookmarked);
  const toggleBookmark = useCallback(async () => {
    try {
      if (bookmarked) {
        setBookmarked(postId, false);
        await unbookmarkPost(postId);
      } else {
        setBookmarked(postId, true);
        await bookmarkPost(postId);
      }
    } catch (error) {
      setBookmarked(postId, bookmarked);
    }
  }, [postId, bookmarked, setBookmarked]);

  return { bookmarked, toggleBookmark };
}
