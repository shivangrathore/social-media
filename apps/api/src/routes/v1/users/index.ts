import { Router } from "express";
import {
  followUser,
  getCurrentUser,
  getUserByUsername,
  suggestUsers,
  unfollowUser,
  searchUsers,
} from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();
router.use(authMiddleware);

router.get("/@me", getCurrentUser);
router.get("/suggestions", suggestUsers);
router.get("/username/:username", getUserByUsername);
router.post("/:username/follow", followUser);
router.delete("/:username/follow", unfollowUser);
router.get("/search", searchUsers);
export { router as userRouter };
