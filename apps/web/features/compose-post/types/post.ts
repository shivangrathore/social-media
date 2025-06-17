import { AttachmentFile } from ".";

export type Post = {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
  attachments: AttachmentFile[];
  updatedAt: Date | null;
};
