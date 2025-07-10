import { Hashtag } from "@repo/types";
import { IHashtagRepository } from "./respository";
import { hashtagTable, postHashtagTable } from "@/db/schema";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { DatabaseError } from "pg";

export class HashtagRepository implements IHashtagRepository {
  async linkHashtagToPost(hashtagId: number, postId: number): Promise<void> {
    await db.transaction(async (tx) => {
      try {
        await tx.insert(postHashtagTable).values({
          hashtagId: hashtagId,
          postId,
        });
      } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
          return; // Duplicate entry, ignore
        }
      }

      await tx
        .update(hashtagTable)
        .set({
          postCount: sql`${hashtagTable.postCount} + 1`,
        })
        .where(eq(hashtagTable.id, hashtagId));
    });
  }

  async upsert(name: string): Promise<Hashtag> {
    const hashtag = await db.query.hashtagTable.findFirst({
      where: (table, { eq }) => eq(table.name, name),
    });
    if (hashtag) {
      return hashtag;
    }
    const newHashtag = await db
      .insert(hashtagTable)
      .values({
        name,
      })
      .returning();
    return newHashtag[0];
  }

  async searchByName(name: string, limit: number = 10): Promise<Hashtag[]> {
    const hashtags = await db.query.hashtagTable.findMany({
      where: (table, { ilike }) => ilike(table.name, `%${name}%`),
      orderBy: (table, { desc }) => [desc(table.postCount)],
      limit,
    });
    return hashtags;
  }
}
