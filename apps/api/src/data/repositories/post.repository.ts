import { postTable, postViewTable, userBookmarkTable } from "@/db/schema";
import { IPost, IPostRepository } from "./respository";
import { PostType } from "@repo/types";
import { and, eq, InferSelectModel, isNull, sql } from "drizzle-orm";
import { db } from "@/db";

type DBPost = InferSelectModel<typeof postTable>;

export class PostRepository implements IPostRepository {
  mapDbPostToIPost(dbPost: DBPost): IPost {
    return {
      id: dbPost.id,
      userId: dbPost.userId,
      content: dbPost.content,
      createdAt: dbPost.createdAt,
      updatedAt: dbPost.updatedAt,
      type: dbPost.postType,
      publishedAt: dbPost.publishedAt,
    };
  }
  async getDraftByUserAndType(
    userId: number,
    type: PostType,
  ): Promise<IPost | null> {
    const result = await db.query.postTable.findFirst({
      where: and(
        eq(postTable.userId, userId),
        eq(postTable.postType, type),
        isNull(postTable.publishedAt),
      ),
    });
    return result ? this.mapDbPostToIPost(result) : null;
  }

  async createDraft(
    userId: number,
    type: PostType,
    content?: string,
  ): Promise<IPost> {
    const dbPost = await db
      .insert(postTable)
      .values({
        userId,
        postType: type,
        content,
      })
      .returning();
    return this.mapDbPostToIPost(dbPost[0]);
  }

  async updateContent(
    postId: number,
    content: string | null,
  ): Promise<IPost | null> {
    const result = await db
      .update(postTable)
      .set({
        content,
      })
      .where(eq(postTable.id, postId))
      .returning();
    return result.length ? this.mapDbPostToIPost(result[0]) : null;
  }

  async getById(postId: number): Promise<IPost | null> {
    const result = await db.query.postTable.findFirst({
      where: eq(postTable.id, postId),
    });
    return result ? this.mapDbPostToIPost(result) : null;
  }
  async publish(postId: number): Promise<IPost | null> {
    const result = await db
      .update(postTable)
      .set({
        publishedAt: new Date(),
      })
      .where(eq(postTable.id, postId))
      .returning();
    return result.length ? this.mapDbPostToIPost(result[0]) : null;
  }

  async logView(postId: number, userId: number): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(postViewTable).values({
        postId,
        userId,
      });
      await tx
        .update(postTable)
        .set({
          viewCount: sql`${postTable.viewCount} + 1`,
        })
        .where(eq(postTable.id, postId));
    });
  }

  async bookmarkPost(postId: number, userId: number): Promise<void> {
    await db.insert(userBookmarkTable).values({
      userId,
      targetId: postId,
    });
  }
}
