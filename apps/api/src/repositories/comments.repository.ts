import { db } from "@/db";
import { commentTable, postTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export class CommentsRepository {
  async add(userId: number, postId: number, content: string) {
    await db.transaction(async (tx) => {
      await tx.insert(commentTable).values({
        userId,
        postId,
        content,
      });
      await tx
        .update(postTable)
        .set({
          comments: sql`${postTable.comments} + 1`,
        })
        .where(eq(postTable.id, postId));
    });
  }
  async remove(id: number) {
    await db.transaction(async (tx) => {
      const comment = await tx
        .select()
        .from(commentTable)
        .where(eq(commentTable.id, id))
        .limit(1)
        .then((res) => res[0]);
      if (!comment) return;
      await tx.delete(commentTable).where(eq(commentTable.id, id));
      await tx
        .update(postTable)
        .set({
          comments: sql`${postTable.comments} - 1`,
        })
        .where(eq(postTable.id, comment.postId));
    });
  }
}
