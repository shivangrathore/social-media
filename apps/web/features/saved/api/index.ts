import { apiClient } from "@/lib/apiClient";
import { GetFeedResponse } from "@repo/types";

export async function getSavedPosts() {
  const res = await apiClient.get<GetFeedResponse>("/feed/saved");
  return res.data;
}
