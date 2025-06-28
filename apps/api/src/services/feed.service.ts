import { eq } from "drizzle-orm";
import { db } from "../db";
import { attachmentTable } from "../db/schema";
import { type FeedRepository } from "../repositories/feed.repository";
import { FeedPost, FeedResponse } from "@repo/api-types/feed";
import { Post, User } from "@repo/api-types";

// TODO: Implement Feed repository interface
//
type PostWithoutAttachments = Omit<Post, "attachments"> & {};

export class FeedService {
  constructor(private feedRepository: FeedRepository) {
    this.feedRepository = feedRepository;
  }
  async getFeed(
    currentUserId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<FeedResponse> {
    const records = await this.feedRepository.getFeedPosts(
      currentUserId,
      cursor,
      limit,
    );
    const data = await Promise.all(
      records.slice(0, limit).map(async (record) => {
        const post = record.post;
        const author = record.user;
        if (post.postType === "poll") {
          return await this.buildPollEntry(
            post,
            author,
            currentUserId,
            record.bookmarked,
          );
        } else {
          return await this.buildRegularEntry(
            post,
            author,
            currentUserId,
            record.bookmarked,
          );
        }
      }),
    );

    return {
      data,
      nextCursor: records.length > limit ? records.at(-1)!.post.id : null,
    };
  }

  private async buildPollEntry(
    post: PostWithoutAttachments,
    author: User,
    userId: number,
    bookmarked: boolean | undefined,
  ): Promise<FeedPost> {
    const poll = await this.feedRepository.getPollData(post.id);
    const options = await this.feedRepository.getPollOptions(poll.id);
    const userVote = await this.feedRepository.getUserPollVote(poll.id, userId);
    const liked = await this.feedRepository.getUserLikeStatus(post.id, userId);
    const record: FeedPost = {
      ...post,
      bookmarked: bookmarked ?? false,
      author,
      options,
      question: poll.question,
      selectedOption: userVote,
      liked,
      postType: "poll",
    };
    return record;
  }

  private async buildRegularEntry(
    post: PostWithoutAttachments,
    author: User,
    userId: number,
    bookmarked: boolean | undefined,
  ): Promise<FeedPost> {
    const attachments = await db
      .select()
      .from(attachmentTable)
      .where(eq(attachmentTable.postId, post.id));
    const liked = await this.feedRepository.getUserLikeStatus(post.id, userId);
    const record: FeedPost = {
      ...post,
      bookmarked: bookmarked ?? false,
      author,
      attachments,
      liked,
      postType: "regular",
    };
    return record;
  }
}
