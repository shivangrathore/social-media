import { useCallback, useState } from "react";
import { bookmarkPost, unbookmarkPost } from "../api";

export function useBookmarked(postId: number, initialValue: boolean) {
  const [bookmarked, setBookmarked] = useState(initialValue);

  const toggleBookmark = useCallback(async () => {
    const oldValue = bookmarked;
    try {
      if (bookmarked) {
        setBookmarked(false);
        unbookmarkPost(postId);
      } else {
        setBookmarked(true);
        await bookmarkPost(postId);
      }
    } catch (error) {
      setBookmarked(oldValue);
    }
  }, [postId, bookmarked, setBookmarked]);

  return { bookmarked, toggleBookmark };
}
