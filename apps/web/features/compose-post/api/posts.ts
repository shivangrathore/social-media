import { apiClient } from "@/lib/apiClient";
import { Post } from "@repo/api-types";
import { CreateDraftPostResponse } from "@repo/api-types/post";

// TODO: Handle errors and loading states properly
export async function createDraftPost() {
  const res = await apiClient.post<CreateDraftPostResponse>("/posts");
  return res.data;
}

export async function saveDraftPost(post: Post) {
  const res = await apiClient.patch<Post>(`/posts/${post.id}`, {
    content: post.content || "",
  });
  return res.data;
}

export async function publishPost(postId: number) {
  const res = await apiClient.post<Post>(`/posts/${postId}/publish`);
  return res.data;
}
