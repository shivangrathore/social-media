import { Router } from "express";
import { getCurrentUser, getUserByUsername, suggestUsers } from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.get("/@me", authMiddleware, getCurrentUser);
router.get("/suggestions", authMiddleware, suggestUsers);
router.get("/username/:username", getUserByUsername);
export { router as userRouter };
