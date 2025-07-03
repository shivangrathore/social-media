import { IUser } from "@repo/types";
import { IUserRepository } from "./respository";
import { db } from "@/db";
import { userView } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
  async getById(userId: number): Promise<IUser | null> {
    const result = await db
      .select()
      .from(userView)
      .where(eq(userView.id, userId));
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}
