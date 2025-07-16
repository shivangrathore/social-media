import { Router } from "express";
import express from "express";
import authMiddleware from "@/middlewares/auth";
import { authRouter } from "./auth/";
import { userRouter } from "./users/";
import { postRouter } from "./posts/";
import { uploadRouter } from "./uploads/";
import { feedRouter } from "./feed/";
import { commentRouter } from "./comments/";
import { hashtagsRouter } from "./hashtags";
import { trendingRouter } from "./trending";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);
router.use("/users", express.json(), userRouter);
router.use("/posts", express.json(), authMiddleware, postRouter);
router.use("/uploads", express.json(), uploadRouter);
router.use("/feed", express.json(), authMiddleware, feedRouter);
router.use("/comments", express.json(), authMiddleware, commentRouter);
router.use("/hashtags", express.json(), authMiddleware, hashtagsRouter);
router.use("/trending", express.json(), trendingRouter);

export default router;
