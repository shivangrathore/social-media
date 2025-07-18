import { Chat, ChatType, User } from "@repo/types";
import { IChatRepository } from "./respository";
import { db } from "@/db";
import { chatTable, chatUserTable, userView } from "@/db/schema";
import { and, desc, eq, getViewSelectedFields } from "drizzle-orm";

export class ChatRepository implements IChatRepository {
  async getChats(
    userId: number,
    cursor?: number,
    limit?: number,
  ): Promise<Chat[]> {
    const chats = await db
      .select({
        chat: chatTable,
      })
      .from(chatUserTable)
      .innerJoin(chatTable, eq(chatUserTable.chatId, chatTable.id))
      .where(
        and(
          cursor ? eq(chatTable.id, cursor) : undefined,
          eq(chatUserTable.userId, userId),
        ),
      )
      .innerJoin(chatUserTable, eq(chatUserTable.chatId, chatTable.id))
      .orderBy(desc(chatTable.createdAt))
      .limit(limit ?? 10);

    const results: Chat[] = [];

    for (const chat of chats) {
      const users = await db
        .select({ user: getViewSelectedFields(userView) })
        .from(chatUserTable)
        .where(eq(chatUserTable.chatId, chat.chat.id))
        .innerJoin(userView, eq(chatUserTable.userId, userView.id));
      results.push({
        id: chat.chat.id,
        createdAt: chat.chat.createdAt,
        users: users.map((u) => u.user as User),
      });
    }
    return results;
  }

  async createChat(userIds: number[], type: ChatType): Promise<Chat> {
    return await db.transaction<Chat>(async (tx) => {
      const newChat = await tx
        .insert(chatTable)
        .values({
          type,
        })
        .returning();
      for (const userId of userIds) {
        await tx.insert(chatUserTable).values({
          chatId: newChat[0].id,
          userId,
        });
      }
      return newChat[0];
    });
  }

  async getChatById(chatId: number): Promise<Chat | null> {
    const [chat] = await db
      .select()
      .from(chatTable)
      .where(eq(chatTable.id, chatId));

    if (!chat) return null;

    const users = await db
      .select({
        user: getViewSelectedFields(userView),
      })
      .from(chatUserTable)
      .where(eq(chatUserTable.chatId, chatId))
      .innerJoin(userView, eq(chatUserTable.userId, userView.id));

    // TODO: Safe map user type

    return {
      id: chat.id,
      createdAt: chat.createdAt,
      users: users.map((u) => u.user as User),
    };
  }
}
