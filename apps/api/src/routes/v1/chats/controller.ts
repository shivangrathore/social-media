import {
  chatRepository,
  messageRepository,
  userRepository,
} from "@/data/repositories";
import { emitNewChat, emitNewMessage, joinChat } from "@/socket/services/chat";
import {
  CreateChatSchema,
  CreateMessageSchema,
  GetChatsResponse,
} from "@repo/types";
import { Request, Response } from "express";
import { z } from "zod";

const GetChatsQuerySchema = z.object({
  cursor: z.number().optional(),
  limit: z.coerce.number().default(10),
});

export async function getChats(req: Request, res: Response<GetChatsResponse>) {
  const { cursor, limit } = await GetChatsQuerySchema.parseAsync(req.query);
  const userId = res.locals["userId"];
  const data = await chatRepository.getChats(userId, cursor, limit + 1);
  const chats = data.slice(0, limit);
  let nextCursor: number | null = null;
  if (data.length > limit) {
    nextCursor = data[limit].id;
  }

  res.status(200).json({
    data: chats,
    nextCursor: nextCursor,
  });
}

export async function createChat(req: Request, res: Response) {
  const currentUserId = res.locals["userId"];
  const { userId } = await CreateChatSchema.parseAsync(req.body);
  const chat = await chatRepository.getChatByUserIds([userId, currentUserId]);
  if (chat) {
    res.status(200).json(chat);
    return;
  }
  const userIds = [userId, currentUserId];
  const newChat = await chatRepository.createChat(userIds, "private");
  emitNewChat(newChat, ...userIds);
  await joinChat(newChat.id, ...userIds);
  res.status(201).json(newChat);
}

export async function getChat(req: Request, res: Response) {
  const chatId = parseInt(req.params.chatId, 10);
  if (isNaN(chatId)) {
    res.status(400).json({ error: "Invalid chat ID" });
    return;
  }
  const chat = await chatRepository.getChatById(chatId);
  if (!chat) {
    res.status(404).json({ error: "Chat not found" });
    return;
  }
  res.status(200).json(chat);
}

export async function createMessage(req: Request, res: Response) {
  const chatId = parseInt(req.params.chatId, 10);
  if (isNaN(chatId)) {
    res.status(400).json({ error: "Invalid chat ID" });
    return;
  }
  const userId = res.locals["userId"];
  const { content } = await CreateMessageSchema.parseAsync(req.body);

  const message = await messageRepository.createMessage(
    chatId,
    userId,
    content,
  );
  const user = await userRepository.getById(userId);
  emitNewMessage(chatId, {
    ...message,
    user: user!,
  });
  res.status(201).json(message);
}

export async function getMessages(req: Request, res: Response) {
  const chatId = parseInt(req.params.chatId, 10);
  if (isNaN(chatId)) {
    res.status(400).json({ error: "Invalid chat ID" });
    return;
  }
  const messages = await messageRepository.getMessages(chatId);
  res.status(200).json(messages);
}
