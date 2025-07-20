import { ChatMessage } from "@repo/types";
import { getIO } from "..";

export function emitNewMessage(chatId: number, message: ChatMessage) {
  const io = getIO();
  io.to(`chat:${chatId}`).emit("message:new", message);
  console.log(`New message emitted to chat ${chatId}:`, message);
}
