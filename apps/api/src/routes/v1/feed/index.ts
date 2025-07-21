import { Router } from "express";
import {
  getFeedPost,
  getSavedPosts,
  getUserFeed,
  getUserPosts,
  getPostComments,
} from "./controller";

const router: Router = Router();

router.get("/", getUserFeed);
router.get("/saved", getSavedPosts);
router.get("/user/:userId", getUserPosts);
router.get("/posts/:postId", getFeedPost);
router.get("/posts/:postId/comments", getPostComments);

export { router as feedRouter };
