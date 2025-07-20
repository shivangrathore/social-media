import {
  chatRepository,
  messageRepository,
  userRepository,
} from "@/data/repositories";
import { emitNewMessage } from "@/socket/services/chat";
import { CreateChatSchema, CreateMessageSchema } from "@repo/types";
import { Request, Response } from "express";

export async function getChats(req: Request, res: Response) {
  const userId = res.locals["userId"];
  const chats = await chatRepository.getChats(userId, undefined, 10);
  res.status(200).json(chats);
}

export async function createChat(req: Request, res: Response) {
  const currentUserId = res.locals["userId"];
  const { userId } = await CreateChatSchema.parseAsync(req.body);
  const chat = await chatRepository.getChatByUserIds([userId, currentUserId]);
  if (chat) {
    res.status(200).json(chat);
    return;
  }
  const newChat = await chatRepository.createChat(
    [userId, currentUserId],
    "private",
  );
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
