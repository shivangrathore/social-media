import { apiClient } from "@/lib/apiClient";
import { GetPostCommentsResponse } from "@repo/types";

export async function createComment({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) {
  const resp = await apiClient.post(`/posts/${postId}/comments`, {
    content,
  });
  return resp.data;
}

export async function getComments(postId: number, cursor?: number | null) {
  const resp = await apiClient.get<GetPostCommentsResponse>(
    `/feed/posts/${postId}/comments`,
    {
      params: {
        cursor: cursor || undefined,
        limit: 10,
      },
    },
  );
  return resp.data;
}
