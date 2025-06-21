import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  likeTable,
  pollOptionTable,
  pollTable,
  pollVoteTable,
  postTable,
  profileTable,
  userTable,
} from "../db/schema";

export class FeedRepository {
  async getFeedPosts(cursor?: number, limit: number = 10) {
    return await db
      .select({
        post: postTable,
        user: {
          id: userTable.id,
          username: profileTable.username,
          avatar: userTable.avatar,
          firstName: userTable.firstName,
          lastName: userTable.lastName,
          createdAt: userTable.createdAt,
        },
      })
      .from(postTable)
      .limit(limit + 1)
      .where(
        and(
          cursor ? eq(postTable.id, cursor) : undefined,
          eq(postTable.published, true),
        ),
      )
      .orderBy(desc(postTable.createdAt))
      .innerJoin(userTable, eq(userTable.id, postTable.userId))
      .innerJoin(profileTable, eq(profileTable.userId, userTable.id));
  }

  async getPollData(postId: number) {
    const [poll] = await db
      .select()
      .from(pollTable)
      .where(eq(pollTable.postId, postId));
    return poll;
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
}
