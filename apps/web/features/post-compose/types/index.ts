import { AttachmentFile } from "@repo/api-types";

export type PostComposeMode = "post" | "poll";

export type UploadFile = {
  id: string;
  file: File;
  url: string;
  progress: number;
  uploaded: boolean;
  attachment?: AttachmentFile;
};
