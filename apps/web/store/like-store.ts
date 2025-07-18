"use client";
import { create } from "zustand";

type LikeStore = {
  likedPosts: Record<number, boolean>;
  likeCounts: Record<number, number>;
  clearLikes: () => void;
  setLiked: (postId: number, liked: boolean) => void;
  setLikeCount: (postId: number, count: number) => void;
};

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedPosts: {},
  likeCounts: {},
  clearLikes: () => set({ likedPosts: {}, likeCounts: {} }),
  setLiked: (postId, liked) => {
    set((state) => ({
      likedPosts: {
        ...state.likedPosts,
        [postId]: liked,
      },
    }));
  },
  setLikeCount: (postId, count) => {
    count = Math.max(count, 0);
    set((state) => ({
      likeCounts: {
        ...state.likeCounts,
        [postId]: count,
      },
    }));
  },
}));
