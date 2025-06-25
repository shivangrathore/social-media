import { apiClient } from "@/lib/apiClient";
import { CreateDraftPostResponse } from "@repo/api-types/post";

// TODO: Handle errors and loading states properly
export async function createDraftPost() {
  const res = await apiClient.post<CreateDraftPostResponse>("/posts");
  return res.data;
}

export async function saveDraftPost(post: {
  id: number;
  content?: string | null;
}) {
  const res = await apiClient.patch(`/posts/${post.id}`, {
    content: post.content || "",
  });
  return res.data;
}

export async function publishPost(postId: number) {
  const res = await apiClient.post(`/posts/${postId}/publish`);
  return res.data;
}
