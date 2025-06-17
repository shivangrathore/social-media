import { apiClient } from "@/lib/apiClient";
import { create } from "zustand";

export type Attachment = {
  id: string;
  url: string;
  resource_type?: string;
  asset_id?: string;
  public_id?: string;
  width?: number;
  height?: number;
};

type PostStore = {
  id: string | null;
  content: string | null;
  attachments: Attachment[];
  isPostLoading: boolean;
  setContent: (content: string | null) => void;
  setId: (id?: string) => void;
  setAttachments: (attachments: Attachment[]) => void;
  setIsPostLoading: (isLoading: boolean) => void;
};

export const createPostStore = create<PostStore>((set) => ({
  id: null,
  content: null,
  attachments: [],
  isPostLoading: true,
  setId: (id) => set({ id }),
  setContent: (content) => set({ content }),
  setAttachments: (attachments) => set({ attachments }),
  setIsPostLoading: (isLoading) => set({ isPostLoading: isLoading }),
}));

export const loadDraftPost = async () => {
  const postStore = createPostStore.getState();
  postStore.setId(undefined);
  postStore.setContent(null);
  postStore.setAttachments([]);
  postStore.setIsPostLoading(true);
  try {
    const res = await apiClient.get(`/posts/draft/`);
    if (res.data) {
      const { id, content, attachments } = res.data;
      postStore.setId(id);
      postStore.setContent(content);
      postStore.setAttachments(attachments || []);
    }
  } finally {
    postStore.setIsPostLoading(false);
  }
};
