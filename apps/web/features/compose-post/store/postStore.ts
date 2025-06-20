import { create } from "zustand";
import { Post } from "@repo/api-types";
import { devtools } from "zustand/middleware";
import { AttachmentFile } from "@repo/api-types";
import { createDraftPost, publishPost, saveDraftPost } from "../api/posts";

type PostStore = {
  post: Post;
  setContent: (content: string) => void;
  isLoading: boolean;
  publishPost: () => Promise<void>;
  loadDraft: () => Promise<void>;
  saveDraft: () => Promise<void>;
  clearDraft: () => void;
  addAttachment: (attachment: AttachmentFile) => void;
};

const defaultPost: Post = {
  postType: "regular",
  content: "",
  id: 0,
  userId: 0,
  createdAt: new Date(),
  attachments: [],
  views: 0,
  updatedAt: new Date(),
};

export const postStore = create(
  devtools<PostStore>((set, get) => ({
    post: defaultPost,
    isLoading: true,
    setContent: (content: string) =>
      set((state) => ({
        post: {
          ...state.post,
          content,
        },
      })),
    saveDraft: async () => {
      await saveDraftPost(get().post);
    },
    publishPost: async () => {
      const postId = get().post.id;
      set({ isLoading: true });
      try {
        await publishPost(postId);
        get().clearDraft();
      } finally {
        set({ isLoading: false });
      }
    },
    loadDraft: async () => {
      set({ isLoading: true });
      const cloudPost = await createDraftPost();
      set({ post: cloudPost, isLoading: false });
    },
    clearDraft: () => {
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
