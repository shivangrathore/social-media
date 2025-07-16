import { apiClient } from "@/lib/apiClient";
import { TrendingTag } from "@repo/types";

export async function getTrendingTags() {
  const res = await apiClient.get<TrendingTag[]>("/trending/tags");
  return res.data;
}
