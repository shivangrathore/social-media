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
