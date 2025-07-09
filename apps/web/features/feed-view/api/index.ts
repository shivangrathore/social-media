import { apiClient } from "@/lib/apiClient";

export const fetchFeed = async () => {
  const res = await apiClient.get("/feed", {});
  return res.data;
};

export const castVote = async (postId: number, optionId: number) => {
  const res = await apiClient.post(`/posts/${postId}/poll/vote`, { optionId });
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
