import { Router } from "express";
import authMiddleware from "@/middlewares/auth";
import { commentTable } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

const router: Router = Router();
router.use(authMiddleware);
export default router;

router.delete("/:commentId", async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  const userId = res.locals["userId"];

  const result = await db
    .delete(commentTable)
    .where(
      and(eq(commentTable.id, commentId), eq(commentTable.userId, userId)),
    );

  res.json(result);
});

router.delete("/:commentId", async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  const userId = res.locals["userId"];

  const result = await db
    .delete(commentTable)
    .where(
      and(eq(commentTable.id, commentId), eq(commentTable.userId, userId)),
    );

  res.json(result);
});
