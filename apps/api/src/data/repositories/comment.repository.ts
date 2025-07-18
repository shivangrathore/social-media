import { db } from "@/db";
import { ICommentsRepository } from "./respository";
import { commentTable, postTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Comment } from "@repo/types";
import { ServiceError } from "@/utils/errors";

export class CommentRepository implements ICommentsRepository {
  async addComment(
    userId: number,
    postId: number,
    content: string,
    parentId: number | null = null,
  ): Promise<Comment> {
    const comment = await db.transaction(async (tx) => {
      const result = await tx
        .insert(commentTable)
        .values({
          userId,
          content,
          postId,
          parentId,
        })
        .returning();
      await tx
        .update(postTable)
        .set({
          commentCount: sql`${postTable.commentCount} + 1`,
        })
        .where(eq(postTable.id, postId));
      return result[0];
    });
    return comment;
  }

  async removeComment(commentId: number): Promise<void> {
    await db.transaction(async (tx) => {
      const [comment] = await tx
        .delete(commentTable)
        .where(eq(commentTable.id, commentId))
        .returning();
      if (!comment) {
        throw ServiceError.NotFound("Comment not found");
      }
      await tx
        .update(postTable)
        .set({
          commentCount: sql`${postTable.commentCount} - 1`,
        })
        .where(eq(postTable.id, comment.postId));
    });
  }

  async getByUserId(
    userId: number,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Comment[]> {
    const comments = await db
      .select()
      .from(commentTable)
      .where(eq(commentTable.userId, userId))
      .limit(limit)
      .offset(offset);
    return comments;
  }
}
