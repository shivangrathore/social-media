import { apiClient } from "@/lib/apiClient";
import { Comment, GetFeedResponse } from "@repo/types";

export async function getUserPosts(id: number) {
  const res = await apiClient.get<GetFeedResponse>(`/feed/user/${id}`, {});
  return res.data;
}

export async function getUserComments(id: number) {
  const res = await apiClient.get<Comment[]>(`/users/${id}/comments`, {});
  return res.data;
}
