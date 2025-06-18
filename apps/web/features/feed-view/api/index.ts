import { apiClient } from "@/lib/apiClient";

export const fetchFeed = async () => {
  const res = await apiClient.get("/posts", {});
  return res.data;
};
