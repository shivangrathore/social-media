import { apiClient } from "@/lib/apiClient";
import { Post, CreateDraftSchemaType } from "@repo/types";
import { getAttachments } from "./upload";
import { AxiosError } from "axios";

// TODO: Handle errors and loading states properly
export async function getDraftPost() {
  let post;
  try {
    const res = await apiClient.get<Post>("/posts/draft?type=regular");
    post = res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.log("No draft post found returning null");
      return null;
    }

    throw error;
  }

  const attachments = await getAttachments(post.id);
  return { ...post, attachments };
}

export async function createDraftPost(content: string | undefined) {
  const body: CreateDraftSchemaType = { type: "regular", content };
  const res = await apiClient.post<Post>("/posts/draft", body);
  return { ...res.data, attachments: [] };
}

export async function saveDraftPost(post: {
  id: number;
  content: string | null;
}) {
  const res = await apiClient.patch<Post>(`/posts/${post.id}`, {
    content: post.content || "",
  });
  return res.data;
}

export async function publishPost(postId: number) {
  const res = await apiClient.post<Post>(`/posts/${postId}/publish`);
  return res.data;
}
