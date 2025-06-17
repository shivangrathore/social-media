import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import postsRouter from "./posts";
import uploadRouter from "./upload";
import commentsRouter from "./comments";
import friendRequestsRouter from "./friend-requests";
import draftsRouter from "./drafts";

const router: Router = Router();
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/upload", uploadRouter);
router.use("/comments", commentsRouter);
router.use("/friend-requests", friendRequestsRouter);
router.use("/drafts", draftsRouter);

export default router;
