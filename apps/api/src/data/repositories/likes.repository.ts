import { db } from "@/db";
import { likeTable, postTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { ILike, ILikeRepository } from "./respository";

export class LikeRepository implements ILikeRepository {
  async findLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<ILike | null> {
    const records = await db
      .select()
      .from(likeTable)
      .where(
        and(
          eq(likeTable.targetId, targetId),
          eq(likeTable.userId, userId),
          eq(likeTable.targetType, target),
        ),
      );

    if (records.length === 0) {
      return null;
    }
    return records[0];
  }

  async addLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<ILike> {
    return await db.transaction(async (tx) => {
      const result = await tx
        .insert(likeTable)
        .values({
          targetId: targetId,
          userId,
          targetType: target,
        })
        .returning();
      await tx
        .update(postTable)
        .set({
          likeCount: sql`${postTable.likeCount} + 1`,
        })
        .where(and(eq(postTable.id, targetId)));
      return result[0];
    });
  }

  async removeLike(likeId: number, targetId: number): Promise<ILike | null> {
    return await db.transaction(async (tx) => {
      const result = await tx
        .delete(likeTable)
        .where(eq(likeTable.id, likeId))
        .returning();
      await tx
        .update(postTable)
        .set({
          likeCount: sql`${postTable.likeCount} - 1`,
        })
        .where(eq(postTable.id, targetId));
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
  }
}
