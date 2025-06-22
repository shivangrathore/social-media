import { apiClient } from "@/lib/apiClient";

export async function createComment({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) {
  const resp = await apiClient.post(`/posts/${postId}/comments`, {
    content,
  });
  return resp.data;
}
