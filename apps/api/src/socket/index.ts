import { Server } from "socket.io";
import { registerHandlers } from "./handlers";
import { verifyToken } from "./middleware/auth";
import http from "http";

export function initSocket(server: http.Server) {
  const io = new Server(server);

  io.use(verifyToken);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    registerHandlers(io, socket);
  });

  return io;
}
