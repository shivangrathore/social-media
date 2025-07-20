import { Server, Socket } from "socket.io";

export function registerHandlers(io: Server, socket: Socket) {
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.data.userId}`);
  });
}
