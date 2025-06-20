import { db } from "@/db";
import { postTable, postViewTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export class ViewRepository {
  async logPostView(postId: number, userId: number) {
    // TODO: Implement Redis ttl
    await db.transaction(async (tx) => {
      await tx.insert(postViewTable).values({
        postId,
        userId,
      });
      await tx
        .update(postTable)
        .set({
          views: sql`${postTable.views} + 1`,
        })
        .where(eq(postTable.id, postId));
    });
  }
}
