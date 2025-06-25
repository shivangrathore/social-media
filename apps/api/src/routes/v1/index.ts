import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import postsRouter from "./posts";
import uploadRouter from "./upload";
import commentsRouter from "./comments";
import friendRequestsRouter from "./friend-requests";
import pollsRouter from "./polls";
import feedRouter from "./feed";
import viewsRouter from "./views";
import likesRouter from "./likes";
import attachmentsRouter from "./attachments";
import express from "express";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);
router.use("/users", express.json(), usersRouter);
router.use("/posts", express.json(), postsRouter);
router.use("/upload", uploadRouter);
router.use("/", express.json(), commentsRouter);
router.use("/friend-requests", express.json(), friendRequestsRouter);
router.use("/polls", express.json(), pollsRouter);
router.use("/feed", express.json(), feedRouter);
router.use("/attachments", express.json(), attachmentsRouter);
router.use("/", express.json(), viewsRouter);
router.use("/", express.json(), likesRouter);

export default router;
