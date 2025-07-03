import { Router } from "express";
import express from "express";
import { authRouter } from "./auth/";
import { userRouter } from "./users/";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);
router.use("/users", express.json(), userRouter);

export default router;
