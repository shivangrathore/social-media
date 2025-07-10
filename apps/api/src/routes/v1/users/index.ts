import { Router } from "express";
import {
  followUser,
  getCurrentUser,
  getUserByUsername,
  suggestUsers,
  unfollowUser,
} from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.get("/@me", authMiddleware, getCurrentUser);
router.get("/suggestions", authMiddleware, suggestUsers);
router.get("/username/:username", getUserByUsername);
router.post("/:username/follow", authMiddleware, followUser);
router.delete("/:username/follow", authMiddleware, unfollowUser);
export { router as userRouter };
