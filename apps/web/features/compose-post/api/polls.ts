import { apiClient } from "@/lib/apiClient";
import { CreatePollDraftResponse } from "@repo/api-types/poll";

export async function createDraftPoll() {
  const req = await apiClient.post<CreatePollDraftResponse>("/polls", {});
  return req.data;
}

export async function saveDraftPoll({
  postId,
  question,
  options,
}: {
  postId: number;
  question: string;
  options: string[];
}) {
  await apiClient.patch(`/polls/${postId}`, {
    question,
    options,
  });
}

export async function publishPoll(postId: number) {
  await apiClient.post(`/polls/${postId}/publish`);
}
