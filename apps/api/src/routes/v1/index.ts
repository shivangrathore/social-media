import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import postsRouter from "./posts";
import uploadRouter from "./upload";
import commentsRouter from "./comments";
import friendRequestsRouter from "./friend-requests";
import draftsRouter from "./drafts";
import pollsRouter from "./polls";
import express from "express";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);
router.use("/users", express.json(), usersRouter);
router.use("/posts", express.json(), postsRouter);
router.use("/upload", uploadRouter);
router.use("/comments", express.json(), commentsRouter);
router.use("/friend-requests", express.json(), friendRequestsRouter);
router.use("/drafts", express.json(), draftsRouter);
router.use("/polls", express.json(), pollsRouter);

export default router;
