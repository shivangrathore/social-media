import { db } from "@/db";
import { likeTable, postTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export class LikesRepository {
  async findLike(targetId: number, userId: number, target: "post" | "comment") {
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
      return undefined;
    }
    return records[0];
  }

  async addLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<void> {
    const like = await this.findLike(targetId, userId, target);
    if (like) {
      throw new Error("Like already exists");
    }
    await db.transaction(async (tx) => {
      await tx.insert(likeTable).values({
        targetId: targetId,
        userId,
        targetType: target,
      });
      await tx
        .update(postTable)
        .set({
          likes: sql`${postTable.likes} + 1`,
        })
        .where(and(eq(postTable.id, targetId)));
    });
  }

  async removeLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<void> {
    const like = await this.findLike(targetId, userId, target);
    if (!like) {
      throw new Error("Like does not exist");
    }
    await db.transaction(async (tx) => {
      await tx.delete(likeTable).where(eq(likeTable.id, like.id));
      await tx
        .update(postTable)
        .set({
          likes: sql`${postTable.likes} - 1`,
        })
        .where(eq(postTable.id, targetId));
    });
  }
}
