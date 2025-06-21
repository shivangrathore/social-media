import { apiClient } from "@/lib/apiClient";

export async function postAddLike(postId: number) {
  const res = await apiClient.post(`/posts/${postId}/likes`);
  return res.data;
}

export async function postRemoveLike(postId: number) {
  const res = await apiClient.delete(`/posts/${postId}/likes`);
  return res.data;
}
