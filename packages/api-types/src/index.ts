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

export type Post = {
  id: number;
  content: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date | null;
  attachments: AttachmentFile[];
};

export type User = {
  avatar: string | null;
  createdAt: Date;
  dob: Date | null;
  email: string;
  emailVerified: boolean;
  firstName: string;
  id: number;
  lastName: string;
  updatedAt: Date | null;
};
