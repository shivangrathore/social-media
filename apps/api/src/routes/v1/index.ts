import { Router } from "express";
import authRouter from "./auth";
import express from "express";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);

export default router;
