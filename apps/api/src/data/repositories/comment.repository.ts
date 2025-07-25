import { db } from "@/db";
import { ICommentsRepository } from "./respository";
import { commentTable, postTable, userView } from "@/db/schema";
import { and, desc, eq, getViewSelectedFields, gt, lt, sql } from "drizzle-orm";
import { Comment, CommentWithAuthor } from "@repo/types";
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
    cursor: number | null = null,
    limit: number = 10,
  ): Promise<Comment[]> {
    const comments = await db
      .select()
      .from(commentTable)
      .where(
        and(
          eq(commentTable.userId, userId),
          cursor ? gt(commentTable.id, cursor) : undefined,
        ),
      )
      .limit(limit)
      .orderBy(desc(commentTable.id));
    return comments;
  }

  async getByPostId(
    postId: number,
    cursor: number | null = null,
    limit: number = 10,
  ): Promise<CommentWithAuthor[]> {
    const comments = await db
      .select({
        comment: commentTable,
        user: getViewSelectedFields(userView),
      })
      .from(commentTable)
      .where(
        and(
          eq(commentTable.postId, postId),
          cursor ? lt(commentTable.id, cursor) : undefined,
        ),
      )
      .limit(limit)
      .innerJoin(userView, eq(userView.id, commentTable.userId))
      .orderBy(desc(commentTable.id));
    return comments.map((c) => ({
      ...c.comment,
      user: c.user,
    }));
  }
}
