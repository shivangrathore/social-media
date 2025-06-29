import express from "express";
import v1Router from "./routes/v1";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error-handler";

const app = express();
app.use(cookieParser());
app.use("/api/v1", v1Router);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
