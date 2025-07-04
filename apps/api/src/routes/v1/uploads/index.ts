import { Router } from "express";
import { getSignature } from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.post("/signature", authMiddleware, getSignature);

export { router as uploadRouter };
