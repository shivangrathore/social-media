import {
  attachmentRepository,
  commentRepository,
  feedRepository,
  postRepository,
  userRepository,
} from "@/data/repositories";
import { IFeedPost, IPost } from "@/data/repositories/respository";
import { postTable } from "@/db/schema";
import { ServiceError } from "@/utils/errors";
import {
  Comment,
  FeedPost,
  GetFeedResponse,
  GetPostCommentsResponse,
  User,
} from "@repo/types";
import { InferSelectModel } from "drizzle-orm";
import { Request, Response } from "express";
import { z } from "zod";

type PostWithoutAttachments = InferSelectModel<typeof postTable>;

async function prepareFeedPosts(
  currentUserId: number,
  records: IFeedPost[],
  limit: number,
) {
  const data = await Promise.all(
    records.slice(0, limit).map(async (record) => {
      const post = record.post;
      const author = record.user;
      if (post.postType === "poll") {
        return await buildPollEntry(
          post,
          author,
          currentUserId,
          record.bookmarkedByMe,
        );
      } else {
        return await buildRegularEntry(
          post,
          author,
          currentUserId,
          record.bookmarkedByMe,
        );
      }
    }),
  );

  return {
    data,
    nextCursor: records.length > limit ? records.at(-1)!.post.id : null,
  };
}

async function getFeed(
  currentUserId: number,
  cursor?: number,
  limit: number = 10,
): Promise<GetFeedResponse> {
  const records = await feedRepository.getFeedPosts(
    currentUserId,
    cursor,
    limit,
  );

  return await prepareFeedPosts(currentUserId, records, limit);
}

async function buildPollEntry(
  post: PostWithoutAttachments,
  author: User,
  userId: number,
  bookmarked: boolean | undefined,
): Promise<FeedPost> {
  const poll = await feedRepository.getPollData(post.id);
  if (!poll) {
    throw new Error("Poll data not found for post");
  }
  const options = await feedRepository.getPollOptions(poll.id);
  const userVote = await feedRepository.getUserPollVote(poll.id, userId);
  const likedByMe = await feedRepository.getUserLikeStatus(post.id, userId);
  const record: FeedPost = {
    ...post,
    bookmarkedByMe: bookmarked ?? false,
    author,
    options,
    selectedOption: userVote,
    likedByMe,
    postType: "poll",
    expiresAt: poll.expiresAt,
  };
  return record;
}

async function buildRegularEntry(
  post: PostWithoutAttachments,
  author: User,
  userId: number,
  bookmarked: boolean | undefined,
): Promise<FeedPost> {
  const attachments = await attachmentRepository.getAttachmentsByPostId(
    post.id,
  );
  const likedByMe = await feedRepository.getUserLikeStatus(post.id, userId);
  const record: FeedPost = {
    ...post,
    bookmarkedByMe: bookmarked ?? false,
    author,
    attachments,
    likedByMe,
    postType: "regular",
  };
  return record;
}

const feedQuerySchema = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().default(10),
});

export const getUserFeed = async (
  req: Request,
  res: Response<GetFeedResponse>,
) => {
  const feedQuery = await feedQuerySchema.parseAsync(req.query);
  const cursor = feedQuery.cursor;
  const limit = feedQuery.limit;
  const userId = res.locals["userId"];
  const feed = await getFeed(userId, cursor, limit);
  res.status(200).json(feed);
};

export const getSavedPosts = async (
  req: Request,
  res: Response<GetFeedResponse>,
) => {
  const feedQuery = await feedQuerySchema.parseAsync(req.query);
  const cursor = feedQuery.cursor;
  const limit = feedQuery.limit;
  const userId = res.locals["userId"];
  const records = await feedRepository.getUserBookmarkedPosts(
    userId,
    cursor,
    limit,
  );
  const data = await prepareFeedPosts(userId, records, limit);
  res.status(200).json(data);
};

export const getUserPosts = async (
  req: Request,
  res: Response<GetFeedResponse>,
) => {
  // FIXME: Check if current user has permission to view this user's posts
  const feedQuery = await feedQuerySchema.parseAsync(req.query);
  const cursor = feedQuery.cursor;
  const limit = feedQuery.limit;
  const userId = parseInt(req.params.userId, 10);
  const records = await feedRepository.getUserPosts(userId, cursor, limit);
  const data = await prepareFeedPosts(userId, records, limit);
  res.status(200).json(data);
};

export const getFeedPost = async (req: Request, res: Response<FeedPost>) => {
  const postId = parseInt(req.params.postId, 10);
  const post = await feedRepository.getFeedPost(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  let feedPost: FeedPost;
  if (post.post.postType == "poll") {
    feedPost = await buildPollEntry(
      post.post,
      post.user,
      res.locals["userId"],
      post.bookmarkedByMe,
    );
  } else {
    feedPost = await buildRegularEntry(
      post.post,
      post.user,
      res.locals["userId"],
      post.bookmarkedByMe,
    );
  }
  res.status(200).json(feedPost);
};

const GetPostCommentsQuerySchema = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().default(10),
});

export const getPostComments = async (
  req: Request,
  res: Response<GetPostCommentsResponse>,
) => {
  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
    throw ServiceError.BadRequest("Invalid post ID");
  }

  const { cursor, limit } = await GetPostCommentsQuerySchema.parseAsync(
    req.query,
  );

  const data = await commentRepository.getByPostId(postId, cursor, limit + 1);

  const comments = data.slice(0, limit);

  let nextCursor: number | null = null;

  if (data.length > limit) {
    nextCursor = data[limit - 1].id;
  }
  res.status(200).json({ data: comments, nextCursor });
};
