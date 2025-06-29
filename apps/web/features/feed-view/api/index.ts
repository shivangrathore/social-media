import { apiClient } from "@/lib/apiClient";
import {} from "@repo/api-types";

export const fetchFeed = async () => {
  const res = await apiClient.get("/feed", {});
  return res.data;
};

export const castVote = async (pollId: number, optionId: number) => {
  const res = await apiClient.post(`/polls/${pollId}/vote`, { optionId });
  return res.data;
};

export const logView = async (postId: number) => {
  const res = await apiClient.post(`/posts/${postId}/views`, {});
  return res.data;
};

export const bookmarkPost = async (postId: number) => {
  const res = await apiClient.post(`/posts/${postId}/bookmark`, {});
  return res.data;
};

export const unbookmarkPost = async (postId: number) => {
  const res = await apiClient.delete(`/posts/${postId}/bookmark`, {});
  return res.data;
};
