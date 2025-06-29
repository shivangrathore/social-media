import { db } from "@/db";
import { IAccount, IAuthRepository, IUser } from "./respository";
import {
  accountTable,
  profileTable,
  sessionTable,
  userTable,
  userView,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import { RegisterUserSchemaType } from "@repo/request-schemas";
import { ProviderUser } from "@/auth_providers/base";
import { ServiceError } from "@/utils/errors";

type DBUser = typeof userView.$inferSelect;

export class AuthRepository implements IAuthRepository {
  private mapUser(user: DBUser): IUser {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      name: user.name,
      avatar: user.avatar,
    };
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    const user = await db
      .select()
      .from(userView)
      .where(eq(userView.username, username))
      .limit(1);
    return user.length ? this.mapUser(user[0]) : null;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await db
      .select()
      .from(userView)
      .where(eq(userView.email, email))
      .limit(1);
    return user.length ? this.mapUser(user[0]) : null;
  }

  async register(
    payload: RegisterUserSchemaType,
    username: string,
    hashedPassword: string,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      let userId: number;
      try {
        const result = await tx
          .insert(userTable)
          .values({
            email: payload.email,
          })
          .returning({ id: userTable.id });
        userId = result[0].id;
      } catch (err) {
        if (err instanceof DatabaseError && err.code === "23505") {
          throw ServiceError.BadRequest("Email already exists");
        }
        throw err;
      }
      await tx.insert(accountTable).values({
        userId,
        provider: "credentials",
        providerAccountId: username,
        password: hashedPassword,
      });
      await tx.insert(profileTable).values({
        userId,
        username,
        bio: null,
        location: null,
        type: "user",
        name: payload.name,
      });
    });
  }

  async findAccountByUserId(
    userId: number,
    provider: string,
  ): Promise<IAccount | null> {
    const result = await db
      .select()
      .from(accountTable)
      .where(
        and(
          eq(accountTable.userId, userId),
          eq(accountTable.provider, provider),
        ),
      );
    return result.length ? result[0] : null;
  }

  async registerWithProvider(
    payload: ProviderUser,
    accessToken: string,
    username: string,
    provider: string,
  ): Promise<IUser> {
    const userId = await db.transaction(async (tx) => {
      let userId: number;
      {
        const records = await tx
          .insert(userTable)
          .values({
            email: payload.email,
          })
          .onConflictDoUpdate({
            set: { email: payload.email },
            target: userTable.email,
          })
          .returning({ id: userTable.id });
        userId = records[0].id;
      }
      await tx
        .insert(accountTable)
        .values({
          userId,
          provider,
          providerAccountId: payload.id,
          accessToken,
          accessTokenExpiresAt: null,
          password: null,
        })
        .onConflictDoUpdate({
          target: [accountTable.provider, accountTable.providerAccountId],
          set: {
            accessToken,
            accessTokenExpiresAt: null,
          },
        });
      await tx
        .insert(profileTable)
        .values({
          userId,
          username,
          bio: null,
          location: null,
          type: "user",
          name: payload.name,
        })
        .onConflictDoNothing();

      return userId;
    });
    const user = await this.findUserById(userId);
    return user!;
  }

  async findUserById(userId: number): Promise<IUser | null> {
    const user = await db
      .select()
      .from(userView)
      .where(eq(userView.id, userId))
      .limit(1);
    return user.length ? this.mapUser(user[0]) : null;
  }

  async createSession(
    userId: number,
    token: string,
    expires: Date,
  ): Promise<void> {
    await db.insert(sessionTable).values({
      token,
      userId,
      expires,
    });
  }
}
