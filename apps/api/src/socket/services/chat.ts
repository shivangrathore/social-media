import { Chat, ChatMessage } from "@repo/types";
import { getIO } from "..";

export function emitNewMessage(chatId: number, message: ChatMessage) {
  const io = getIO();
  io.to(`chat:${chatId}`).emit("message:new", message);
  console.log(`New message emitted to chat ${chatId}:`, message);
}

export async function joinChat(chatId: number, ...userIds: number[]) {
  const io = getIO();
  for (const userId of userIds) {
    const sockets = await io.in(`user:${userId}`).fetchSockets();
    for (const socket of sockets) {
      socket.join(`chat:${chatId}`);
      console.log(`User ${userId} joined chat ${chatId}`);
    }
  }
}

export function emitNewChat(chat: Chat, ...userIds: number[]) {
  const io = getIO();
  for (const userId of userIds) {
    io.to(`user:${userId}`).emit("chat:new", chat);
    console.log(`New chat emitted to chat ${chat.id} for user ${userId}`);
  }
}
