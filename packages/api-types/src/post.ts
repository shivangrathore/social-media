import { AttachmentFile, Poll, Post, User } from ".";

export type GetPostsResponse = {
  data: { post: Post; user: User }[];
  nextCursor: string | null;
};

export type CreateDraftPostResponse = {
  id: number;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  userId: number;
  postType: "regular";
  attachments: AttachmentFile[];
};
