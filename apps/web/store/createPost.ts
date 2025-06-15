import { apiClient } from "@/lib/apiClient";
import { create } from "zustand";

type PostStore = {
  post: Post | null;
  setPost: (post: Post) => void;
  resetPost: () => void;
  isPostLoading: boolean;
  loadDraftPost: () => Promise<void>;
};

type Post = {
  id: string;
  content: string | null;
};

export const createPostStore = create<PostStore>((set) => ({
  post: null,
  setPost: (post) => set({ post }),
  isPostLoading: true,
  resetPost: () => set({ post: null }),
  loadDraftPost: async () => {
    set({ isPostLoading: true });
    try {
      const res = await apiClient.get<Post>("/posts/draft");
      set({ post: res.data });
      set({ isPostLoading: false });
    } catch (error) {
      console.error("Failed to load draft post:", error);
      set({ post: null });
    }
  },
}));
