import { apiClient } from "@/lib/apiClient";
import { Poll } from "@repo/api-types";
import { CreatePollDraftResponse } from "@repo/api-types/poll";

export async function createDraftPoll() {
  const req = await apiClient.post<CreatePollDraftResponse>("/polls", {});
  return req.data;
}

export async function saveDraftPoll(poll: Poll) {
  const pollId = poll.id;
  await apiClient.patch(`/polls/${pollId}`, {
    question: poll.question,
    options: poll.options.filter((option) => option.trim() !== ""),
  });
}

export async function publishPoll(postId: number) {
  await apiClient.post(`/polls/${postId}/publish`);
}
