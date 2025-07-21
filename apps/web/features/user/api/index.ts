import { apiClient } from "@/lib/apiClient";
import { Comment, GetFeedResponse, User } from "@repo/types";

export async function getUserPosts(id: number, cursor?: number | null) {
  const res = await apiClient.get<GetFeedResponse>(`/feed/user/${id}`, {
    params: { cursor: cursor || undefined, limit: 5 },
  });
  return res.data;
}

export async function getUserComments(id: number) {
  const res = await apiClient.get<Comment[]>(`/users/${id}/comments`, {});
  return res.data;
}

export async function searchUsers(query: string, ignoreMe: boolean = false) {
  const res = await apiClient.get<User[]>(`/users/search`, {
    params: { query, ignoreMe: ignoreMe || undefined },
  });

  return res.data;
}
