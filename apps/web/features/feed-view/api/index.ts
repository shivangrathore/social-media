import { apiClient } from "@/lib/apiClient";

export const fetchFeed = async () => {
  const res = await apiClient.get("/feed", {});
  return res.data;
};

export const castVote = async (pollId: number, optionId: number) => {
  const res = await apiClient.post(`/polls/${pollId}/vote`, { optionId });
  return res.data;
};
