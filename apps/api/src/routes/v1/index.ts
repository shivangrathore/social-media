import { Router } from "express";
import express from "express";
import { authRouter } from "./auth/";

const router: Router = Router();
router.use("/auth", express.json(), authRouter);

export default router;
