import express from "express";
import v1Router from "./routes/v1";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", v1Router);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
