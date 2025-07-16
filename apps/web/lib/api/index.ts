import { apiClient } from "../apiClient";

export async function followUser(username: string) {
  await apiClient.post(`/users/${username}/follow`);
}

export async function unfollowUser(username: string) {
  await apiClient.delete(`/users/${username}/follow`);
}
