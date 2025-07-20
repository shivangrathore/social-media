import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { registerHandlers } from "./handlers";
import { verifyToken } from "./middleware/auth";

let io: Server | null = null;

export function initSocket(server: HTTPServer) {
  if (io) return io;

  io = new Server(server, {});
  io.use(verifyToken);
  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    await registerHandlers(io!, socket);
  });
  console.log("Socket.io initialized");
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error(
      "Socket.io not initialized. Call initSocket(server) first.",
    );
  }
  return io;
}
