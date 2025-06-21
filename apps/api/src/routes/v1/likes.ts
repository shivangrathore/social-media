import authMiddleware from "@/middlewares/auth";
import { Router } from "express";

const router: Router = Router();
router.use(authMiddleware);
export default router;

import { LikesRepository } from "@/repositories/likes.repository";
import { LikeService } from "@/services/likes.service";

const likesRepository = new LikesRepository();
const likeService = new LikeService(likesRepository);

router.post("/posts/:postId/likes", async (req, res) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId);

  try {
    const like = await likeService.addPostLike(userId, postId);
    res.status(201).json(like);
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/posts/:postId/likes", async (req, res) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId);

  try {
    await likeService.removePostLike(postId, userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/comments/:commentId/likes", async (req, res) => {
  const userId = res.locals["userId"];
  const commentId = parseInt(req.params.commentId);

  try {
    const like = await likeService.addCommentLike(commentId, userId);
    res.status(201).json(like);
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/comments/:commentId/likes", async (req, res) => {
  const userId = res.locals["userId"];
  const commentId = parseInt(req.params.commentId);

  try {
    await likeService.removeCommentLike(commentId, userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
