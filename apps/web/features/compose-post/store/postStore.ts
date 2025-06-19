// Poststore and Uploadstore are meant to be used together.

import { create } from "zustand";
import { Post } from "@repo/api-types";
import { apiClient } from "@/lib/apiClient";
import { devtools } from "zustand/middleware";
import { AttachmentFile } from "@repo/api-types";
import { AxiosError } from "axios";

type PostStore = {
  post: Post;
  setContent: (content: string) => void;
  isLoading: boolean;
  isSaving: boolean;
  createDraft: () => Promise<Post>;
  publishPost: () => Promise<Post>;
  saveToStorage: () => void;
  loadFromStorage: () => Post | undefined;
  loadDraft: () => Promise<void>;
  saveDraft: () => Promise<void>;
  clearDraft: () => void;
  addAttachment: (attachment: AttachmentFile) => void;
};

const defaultPost: Post = {
  content: "",
  id: 0,
  userId: 0,
  createdAt: new Date(),
  attachments: [],
  updatedAt: new Date(),
};

export const postStore = create(
  devtools<PostStore>((set, get) => ({
    post: defaultPost,
    isSaving: false,
    isLoading: true,
    setContent: (content: string) =>
      set((state) => ({
        post: {
          ...state.post,
          content,
        },
      })),
    createDraft: async () => {
      const res = await apiClient.post<Post>("/drafts");
      return res.data;
    },
    saveDraft: async () => {
      set({ isSaving: true });
      const post = get().post;
      try {
        await apiClient.patch<Post>(`/drafts/${post.id}`, {
          content: post.content || "",
        });
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.status == 404) {
            const newPost = await get().createDraft();
            set({ post: newPost });
            return;
          }
        }
      } finally {
        set({ isSaving: false });
      }
    },
    publishPost: async () => {
      const post = get().post;
      set({ isLoading: true });
      try {
        const res = await apiClient.post<Post>(
          `/drafts/${post.id}/publish`,
          get().post,
        );
        set({ post: res.data });
        get().clearDraft();
        return res.data;
      } finally {
        set({ isLoading: false });
      }
    },
    saveToStorage: () => {
      const post = get().post;
      localStorage.setItem("draftPost", JSON.stringify(post));
    },
    loadFromStorage: () => {
      const storedPost = localStorage.getItem("draftPost");
      if (storedPost) {
        return JSON.parse(storedPost) as Post;
      }
    },
    loadDraft: async () => {
      set({ isLoading: true });
      const localPost = get().loadFromStorage();
      const dbPost = await get().createDraft();

      if (!localPost) {
        set({ isLoading: false, post: dbPost });
        get().saveToStorage();
        return;
      }

      if (!dbPost.updatedAt) {
        set({ post: localPost, isLoading: false });
        get().saveDraft();
        return;
      }

      if (!localPost.updatedAt) {
        set({ post: dbPost, isLoading: false });
        return;
      }
      if (localPost.updatedAt > dbPost.updatedAt) {
        set({ post: localPost, isLoading: false });
        get().saveDraft();
      } else {
        set({ post: dbPost, isLoading: false });
        get().saveToStorage();
      }
    },
    clearDraft: () => {
      localStorage.removeItem("draftPost");
      set({ post: defaultPost });
    },
    addAttachment: (attachment) =>
      set((state) => ({
        post: {
          ...state.post,
          attachments: [...state.post.attachments, attachment],
        },
      })),
  })),
);

if (typeof window !== "undefined") {
  postStore.getState().loadDraft();
}
