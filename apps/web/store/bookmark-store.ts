import { create } from "zustand";

type BookmarkStore = {
  bookmarkedPosts: Record<number, boolean>;
  setBookmarked: (postId: number, bookmarked: boolean) => void;
};

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarkedPosts: {},
  setBookmarked: (postId, bookmarked) =>
    set((state) => ({
      bookmarkedPosts: {
        ...state.bookmarkedPosts,
        [postId]: bookmarked,
      },
    })),
}));
