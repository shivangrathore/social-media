import { chatRepository } from "@/data/repositories";
import { Server, Socket } from "socket.io";

export async function registerHandlers(io: Server, socket: Socket) {
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.data.userId}`);
  });

  const chats = await chatRepository.getChats(socket.data.userId);
  chats.forEach((chat) => {
    socket.join(`chat:${chat.id}`);
    console.log(`User ${socket.data.userId} joined chat ${chat.id}`);
  });
}
