import { apiClient } from "@/lib/apiClient";
import { Attachment, CreateAttachmentResponse } from "@repo/types";

export async function addAttachment(type: string, postId: number) {
  const res = await apiClient.post<CreateAttachmentResponse>(
    `/posts/${postId}/attachments`,
    {
      type,
    },
  );
  return res.data;
}

export async function deleteAttachment(attachmentId: number) {
  const res = await apiClient.delete(`/attachments/${attachmentId}`);
  return res.data;
}

export async function getAttachments(postId: number) {
  const res = await apiClient.get<Attachment[]>(`/posts/${postId}/attachments`);
  return res.data;
}
