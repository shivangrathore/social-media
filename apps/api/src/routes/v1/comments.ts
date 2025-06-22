import { Router } from "express";
import authMiddleware from "@/middlewares/auth";
import { commentTable } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { CommentsRepository } from "@/repositories/comments.repository";
import { CommentsService } from "@/services/comments.service";
import { z } from "zod";

const router: Router = Router();
router.use(authMiddleware);
export default router;

const commentsRepository = new CommentsRepository();
const commentsService = new CommentsService(commentsRepository);

router.post("/posts/:postId/comments", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];
  const parentId = await z.coerce
    .number()
    .nullish()
    .default(null)
    .parseAsync(req.query.parentId);
  const content = z.string().min(1).max(500).parse(req.body.content);
  const comment = await commentsService.addComment(userId, postId, content);
  res.status(201).json(comment);
});

router.get("/posts/:postId/comments", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const comments = await db
    .select()
    .from(commentTable)
    .where(eq(commentTable.postId, postId));

  res.json(comments);
});

router.delete("/comments/:commentId", async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  const userId = res.locals["userId"];

  const result = await db
    .delete(commentTable)
    .where(
      and(eq(commentTable.id, commentId), eq(commentTable.userId, userId)),
    );

  res.json(result);
});
