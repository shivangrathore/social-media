import { ChatMessage } from "@repo/types";
import { IMessageRepository } from "./respository";
import { db } from "@/db";
import { messageTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export class MessageRepository implements IMessageRepository {
  async getMessages(
    chatId: number,
    cursor?: number,
    limit: number = 20,
  ): Promise<ChatMessage[]> {
    const results = await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.chatId, chatId))
      .limit(limit);
    return results;
  }

  async getMessageById(messageId: number): Promise<ChatMessage | null> {
    const message = await db
      .select()
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
  ): Promise<ChatMessage> {
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
