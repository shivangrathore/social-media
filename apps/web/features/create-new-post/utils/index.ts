import { FileAdapter, AttachmentFile, UploadFile } from "../types";

export function attachmentAdapter(
  file: UploadFile | AttachmentFile,
): FileAdapter {
  if ("file" in file) {
    return {
      ...file,
      isAttachment: false,
    };
  } else {
    return {
      ...file,
      isAttachment: true,
    };
  }
}
