import {
  and,
  asc,
  desc,
  eq,
  isNotNull,
  sql,
  getViewSelectedFields,
  gt,
} from "drizzle-orm";
import { db } from "@/db";
import {
  likeTable,
  pollOptionTable,
  pollTable,
  pollVoteTable,
  postTable,
  userBookmarkTable,
  userView,
} from "@/db/schema";
import { IFeedPost, IFeedRepository, IPollData } from "./respository";

export class FeedRepository implements IFeedRepository {
  async getFeedPosts(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<IFeedPost[]> {
    return await db
      .select({
        post: postTable,
        user: getViewSelectedFields(userView),
        bookmarkedByMe: sql<boolean>`user_bookmark.id IS NOT NULL`.as(
          "bookmarked",
        ),
      })
      .from(postTable)
      .limit(limit + 1)
      .where(
        and(
          cursor ? gt(postTable.id, cursor) : undefined,
          isNotNull(postTable.publishedAt),
        ),
      )
      .orderBy(desc(postTable.publishedAt))
      .innerJoin(userView, eq(userView.id, postTable.userId))
      .leftJoin(
        userBookmarkTable,
        and(
          eq(userBookmarkTable.targetId, postTable.id),
          eq(userBookmarkTable.type, "post"),
          eq(userBookmarkTable.userId, userId),
        ),
      );
  }

  async getPollData(postId: number): Promise<IPollData | null> {
    const result = await db
      .select()
      .from(pollTable)
      .where(eq(pollTable.postId, postId));
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  async getPollOptions(pollId: number) {
    return await db
      .select()
      .from(pollOptionTable)
      .where(eq(pollOptionTable.pollId, pollId))
      .orderBy(asc(pollOptionTable.id));
  }

  async getUserPollVote(pollId: number, userId: number) {
    const [selectedOption] = await db
      .select({ optionId: pollVoteTable.pollOptionId })
      .from(pollVoteTable)
      .where(
        and(eq(pollVoteTable.pollId, pollId), eq(pollVoteTable.userId, userId)),
      );
    return selectedOption ? selectedOption.optionId : null;
  }

  async getUserLikeStatus(postId: number, userId: number) {
    const [like] = await db
      .select({})
      .from(likeTable)
      .where(
        and(
          eq(likeTable.targetId, postId),
          eq(likeTable.userId, userId),
          eq(likeTable.targetType, "post"),
        ),
      );
    return like ? true : false;
  }

  async getUserBookmarkedPosts(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<IFeedPost[]> {
    return await db
      .select({
        post: postTable,
        user: getViewSelectedFields(userView),
        bookmarkedByMe: sql<boolean>`user_bookmark.id IS NOT NULL`.as(
          "bookmarked",
        ),
      })
      .from(userBookmarkTable)
      .innerJoin(postTable, eq(userBookmarkTable.targetId, postTable.id))
      .innerJoin(userView, eq(userView.id, postTable.userId))
      .where(
        and(
          eq(userBookmarkTable.userId, userId),
          eq(userBookmarkTable.type, "post"),
          cursor ? gt(postTable.id, cursor) : undefined,
        ),
      )
      .orderBy(desc(postTable.publishedAt))
      .limit(limit + 1);
  }

  async getUserPosts(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<IFeedPost[]> {
    return await db
      .select({
        post: postTable,
        user: getViewSelectedFields(userView),
        bookmarkedByMe: sql<boolean>`user_bookmark.id IS NOT NULL`.as(
          "bookmarked",
        ),
      })
      .from(postTable)
      .innerJoin(userView, eq(userView.id, postTable.userId))
      .leftJoin(
        userBookmarkTable,
        and(
          eq(userBookmarkTable.targetId, postTable.id),
          eq(userBookmarkTable.type, "post"),
          eq(userBookmarkTable.userId, userId),
        ),
      )
      .where(
        and(
          eq(postTable.userId, userId),
          cursor ? gt(postTable.id, cursor) : undefined,
          isNotNull(postTable.publishedAt),
          eq(userView.id, userId),
        ),
      )
      .orderBy(desc(postTable.publishedAt))
      .limit(limit + 1);
  }
}
