import { Router } from "express";
import { getSavedPosts, getUserFeed, getUserPosts } from "./controller";

const router: Router = Router();

router.get("/", getUserFeed);
router.get("/saved", getSavedPosts);
router.get("/user/:userId", getUserPosts);

export { router as feedRouter };
