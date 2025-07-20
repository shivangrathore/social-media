import express from "express";
import v1Router from "./routes/v1";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error-handler";
import http from "http";
import { initSocket } from "./socket";

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use("/api/v1", v1Router);
initSocket(server);
app.use(errorHandler);

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
