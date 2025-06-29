import { db } from "@/db";
import { ICommentsRepository } from "./respository";
import { commentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { IComment } from "@repo/types";

export class CommentRepository implements ICommentsRepository {
  async addComment(
    userId: number,
    postId: number,
    content: string,
    parentId: number | null = null,
  ): Promise<IComment> {
    const result = await db
      .insert(commentTable)
      .values({
        userId,
        content,
        postId,
        parentId,
      })
      .returning();
    return result[0];
  }

  async removeComment(commentId: number): Promise<void> {
    await db.delete(commentTable).where(eq(commentTable.id, commentId));
  }
}
