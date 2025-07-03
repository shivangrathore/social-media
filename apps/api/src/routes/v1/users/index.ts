import { Router } from "express";
import { getCurrentUser } from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.get("/@me", authMiddleware, getCurrentUser);
export { router as userRouter };
