import { apiClient } from "@/lib/apiClient";
import { CreateDraftSchemaType, PollMeta } from "@repo/types";
import { Post } from "@repo/types";

export async function createDraftPoll(
  content: string | undefined = undefined,
): Promise<Post> {
  const data: CreateDraftSchemaType = {
    type: "poll",
    content,
  };
  const req = await apiClient.post<Post>("/posts/draft", data);
  return req.data;
}

export async function getPollDraft(): Promise<Post> {
  const req = await apiClient.get<Post>("/posts/draft?type=poll");
  return req.data;
}

export async function getPollMeta(postId: number) {
  const req = await apiClient.get<PollMeta>(`/posts/${postId}/poll`);
  return req.data;
}

export async function saveOptions({
  postId,
  options,
}: {
  postId: number;
  options: string[];
}): Promise<void> {
  const data = { options };
  await apiClient.put(`/posts/${postId}/poll/options`, data);
}
