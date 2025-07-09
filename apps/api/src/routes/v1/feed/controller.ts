import { attachmentRepository, feedRepository } from "@/data/repositories";
import { postTable } from "@/db/schema";
import { FeedPost, GetFeedResponse, User } from "@repo/types";
import { InferSelectModel } from "drizzle-orm";
import { Request, Response } from "express";
import { z } from "zod";

type PostWithoutAttachments = InferSelectModel<typeof postTable>;

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
