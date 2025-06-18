import { AttachmentFile } from "@/types/post";

export type UploadFile = {
  id: string;
  file: File;
  url: string;
  progress: number;
  uploaded: boolean;
};

export type FileAdapter =
  | (UploadFile & {
      isAttachment: false;
    })
  | (AttachmentFile & {
      isAttachment: true;
    });
