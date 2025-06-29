import { postTable } from "@/db/schema";
import { IPost, IPostRepository, PostType } from "./respository";
import { and, eq, InferSelectModel } from "drizzle-orm";
import { db } from "@/db";

type DBPost = InferSelectModel<typeof postTable>;

export class PostRepository implements IPostRepository {
  mapDbPostToIPost(dbPost: DBPost): IPost {
    return {
      id: dbPost.id,
      userId: dbPost.userId,
      content: dbPost.content,
      createdAt: dbPost.createdAt,
      published: dbPost.published,
      updatedAt: dbPost.updatedAt,
      postType: dbPost.postType,
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
        eq(postTable.published, false),
      ),
    });
    return result ? this.mapDbPostToIPost(result) : null;
  }

  async createDraft(userId: number, type: PostType): Promise<IPost> {
    const dbPost = await db
      .insert(postTable)
      .values({
        userId,
        postType: type,
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
        published: true,
      })
      .where(eq(postTable.id, postId))
      .returning();
    return result.length ? this.mapDbPostToIPost(result[0]) : null;
  }
}
