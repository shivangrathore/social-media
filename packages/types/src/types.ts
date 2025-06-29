export interface IUser {
  id: number;
  username: string;
  createdAt: Date;
  avatar: string | null;
  name: string | null;
}
export interface IAttachment {
  id: number;
  url: string;
  assetId: string;
  publicId: string;
  type: "image" | "video";
  userId: number;
  postId: number;
  createdAt: Date;
}

export interface IPost {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  attachments: IAttachment[];
}

export interface IComment {
  id: number;
  userId: number;
  postId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
}
