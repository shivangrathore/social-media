import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import postsRouter from "./posts";

const router: Router = Router();
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);

export default router;
