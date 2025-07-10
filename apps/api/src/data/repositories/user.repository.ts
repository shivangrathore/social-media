import { User } from "@repo/types";
import { IUserRepository } from "./respository";
import { db } from "@/db";
import { followerTable, userView } from "@/db/schema";
import { and, eq, InferSelectViewModel, ne, notExists, sql } from "drizzle-orm";

type DBUser = InferSelectViewModel<typeof userView>;

export class UserRepository implements IUserRepository {
  mapToUser(data: DBUser): User {
    return {
      id: data.id,
      username: data.username,
      avatar: data.avatar,
      createdAt: data.createdAt,
      name: data.name,
    };
  }
  async getById(userId: number): Promise<User | null> {
    const result = await db
      .select()
      .from(userView)
      .where(eq(userView.id, userId));

    if (result.length === 0) {
      return null;
    }
    return this.mapToUser(result[0]);
  }

  async suggestUsers(userId: number): Promise<User[]> {
    const result = await db
      .select()
      .from(userView)
      .where(
        and(
          ne(userView.id, userId),
          notExists(
            db
              .select({})
              .from(followerTable)
              .where(
                and(
                  eq(followerTable.followerId, userId),
                  eq(followerTable.followingId, userView.id),
                ),
              ),
          ),
        ),
      )
      .orderBy(sql`random()`)
      .limit(10);
    return result.map(this.mapToUser);
  }
}
