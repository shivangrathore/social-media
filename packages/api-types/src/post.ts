import { Poll, Post, User } from ".";

export type GetPostsResponse = {
  data: { post: Post; user: User }[];
  nextCursor: string | null;
};

export type CreateDraftPostResponse = (
  | {
      id: number;
      content: string | null;
      postType: "regular";
    }
  | {
      id: number;
      postType: "poll";
      poll: Poll;
    }
) & {
  createdAt: Date;
  userId: number;
};
