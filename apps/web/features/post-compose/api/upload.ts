import { apiClient } from "@/lib/apiClient";
import {
  GetSignatureResponse,
  AddAttachmentSchemaType,
  Attachment,
} from "@repo/types";

export async function getUploadSignature(postId: number) {
  const res = await apiClient.post<GetSignatureResponse>("/uploads/signature", {
    postId: postId,
  });

  return res.data;
}

export async function attachAttachmentToPost(postId: number, file: any) {
  const body: AddAttachmentSchemaType = {
    url: file.url,
    assetId: file.asset_id,
    publicId: file.public_id,
    type: file.resource_type,
  };
  const res = await apiClient.post<Attachment>(
    `/posts/${postId}/attachments`,
    body,
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
