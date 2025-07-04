import { Router } from "express";
import express from "express";
import { authRouter } from "./auth/";
import { userRouter } from "./users/";
import { postRouter } from "./posts/";
import authMiddleware from "@/middlewares/auth";
import { uploadRouter } from "./uploads/";
import { feedRouter } from "./feed/";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);
router.use("/users", express.json(), userRouter);
router.use("/posts", express.json(), authMiddleware, postRouter);
router.use("/uploads", express.json(), uploadRouter);
router.use("/feed", express.json(), feedRouter);

export default router;
