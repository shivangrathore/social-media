import { apiClient } from "@/lib/apiClient";
import { AttachmentFile } from "@repo/api-types";

// TODO: Define in api-types package
type SignatureResponse = {
  signature: string;
  apiKey: string;
  folder: string;
  timestamp: string;
  context: string;
  uploadUrl: string;
};

export async function getUploadSignature(postId: number) {
  const res = await apiClient.post("/upload/signature", {
    postId: postId,
  });

  return res.data as SignatureResponse;
}

export async function attachAttachmentToPost(postId: number, file: any) {
  const res = await apiClient.post(`/posts/${postId}/attachments`, {
    url: file.url,
    assetId: file.asset_id,
    publicId: file.public_id,
    type: file.resource_type,
  });

  return res.data as AttachmentFile;
}

export async function deleteAttachment(attachmentId: number) {
  console.log("Deleting attachment with ID:", attachmentId);
  const res = await apiClient.delete(`/attachments/${attachmentId}`);
  return res.data;
}
