import { ChatMessage } from "@repo/types";
import { IChatMessage, IMessageRepository } from "./respository";
import { db } from "@/db";
import { messageTable, userView } from "@/db/schema";
import {
  and,
  desc,
  eq,
  getTableColumns,
  getViewSelectedFields,
} from "drizzle-orm";

export class MessageRepository implements IMessageRepository {
  async getMessages(
    chatId: number,
    cursor?: number,
    limit: number = 20,
  ): Promise<ChatMessage[]> {
    const results = await db
      .select({
        ...getTableColumns(messageTable),
        user: getViewSelectedFields(userView),
      })
      .from(messageTable)
      .innerJoin(userView, eq(messageTable.userId, userView.id))
      .where(eq(messageTable.chatId, chatId))
      .limit(limit)
      .orderBy(desc(messageTable.createdAt));
    return results;
  }

  async getMessageById(messageId: number): Promise<ChatMessage | null> {
    const message = await db
      .select({
        ...getTableColumns(messageTable),
        user: getViewSelectedFields(userView),
      })
      .from(messageTable)
      .where(eq(messageTable.id, messageId))
      .limit(1);
    if (message.length === 0) {
      return null;
    }
    return message[0];
  }

  async createMessage(
    chatId: number,
    userId: number,
    content: string,
  ): Promise<IChatMessage> {
    const result = await db
      .insert(messageTable)
      .values({
        chatId,
        userId,
        content,
      })
      .returning();

    return result[0];
  }

  async deleteMessage(messageId: number, userId: number): Promise<void> {
    await db
      .delete(messageTable)
      .where(
        and(eq(messageTable.id, messageId), eq(messageTable.userId, userId)),
      );
  }
}
