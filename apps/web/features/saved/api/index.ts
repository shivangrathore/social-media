import { apiClient } from "@/lib/apiClient";
import { GetFeedResponse } from "@repo/types";

export async function getSavedPosts(cursor: number | null = null) {
  const res = await apiClient.get<GetFeedResponse>("/feed/saved", {
    params: {
      cursor,
      limit: 5,
    },
  });
  return res.data;
}
