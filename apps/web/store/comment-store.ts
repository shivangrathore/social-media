import { create } from "zustand";

type CommentStore = {
  commentCount: Record<number, number>;
  setCommentCount: (postId: number, count: number) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  commentCount: {},
  setCommentCount: (postId, count) => {
    count = Math.max(count, 0);
    set((state) => ({
      commentCount: {
        ...state.commentCount,
        [postId]: count,
      },
    }));
  },
}));
