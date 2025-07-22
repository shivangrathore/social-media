import { apiClient } from "@/lib/apiClient";
import { Post, CreateDraftSchemaType } from "@repo/types";

// TODO: Handle errors and loading states properly
export async function getDraftPost() {
  const res = await apiClient.get<Post>("/posts/draft?type=regular");
  return res.data;
}

export async function createDraftPost(content: string | undefined) {
  const body: CreateDraftSchemaType = { type: "regular", content };
  const res = await apiClient.post<Post>("/posts/draft", body);
  return res.data;
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
