import express from "express";
import v1Router from "./routes/v1";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error-handler";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use("/api/v1", v1Router);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.on("disconnect", (socket) => {
  console.log("user disconnected");
});

io.on("joinChat", (chatId) => {
  console.log(`User joined chat: ${chatId}`);
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
