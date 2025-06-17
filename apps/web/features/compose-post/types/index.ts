export type UploadFile = {
  id: string;
  file: File;
  url: string;
  progress: number;
  uploaded: boolean;
};

export type AttachmentFile = {
  id: string;
  postId: number;
  userId: number;
  url: string;
  asset_id: string;
  public_id: string;
  width: number;
  height: number;
  resource_type: string;
};

export type FileAdapter =
  | (UploadFile & {
      isAttachment: false;
    })
  | (AttachmentFile & {
      isAttachment: true;
    });
