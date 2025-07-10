import { Router } from "express";
import { getCurrentUser, suggestUsers } from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.get("/@me", authMiddleware, getCurrentUser);
router.get("/suggestions", authMiddleware, suggestUsers);
export { router as userRouter };
