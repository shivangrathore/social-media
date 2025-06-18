import { Post, User } from ".";

export type GetPostsResponse = {
  data: { post: Post; user: User }[];
  nextCursor: string | null;
};
