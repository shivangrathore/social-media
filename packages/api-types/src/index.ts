export type PostType = "regular" | "poll";
export type AttachmentFile = {
  id: string | number;
  postId: number;
  userId: number;
  url: string;
  asset_id: string;
  public_id: string;
  width: number | null;
  height: number | null;
  resource_type: string;
};

export type Post = {
  id: number;
  content: string | null;
  userId: number;
  postType: PostType;
  createdAt: Date;
  updatedAt: Date | null;
  attachments: AttachmentFile[];
};

export type User = {
  avatar: string | null;
  username: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
};

export type Poll = {
  id: number;
  question: string;
  options: string[];
  userId: number;
  createdAt: Date;
};
