import { db } from "@/db";
import { IFollowRepository } from "./respository";
import { followerTable as followTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export class FollowRepository implements IFollowRepository {
  async followUser(followerId: number, followingId: number): Promise<void> {
    await db.insert(followTable).values({
      followerId,
      followingId,
    });
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db
      .delete(followTable)
      .where(
        and(
          eq(followTable.followerId, followerId),
          eq(followTable.followingId, followingId),
        ),
      );
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await db.query.followerTable.findFirst({
      where: and(
        eq(followTable.followerId, followerId),
        eq(followTable.followingId, followingId),
      ),
    });
    return follow !== undefined;
  }
}
