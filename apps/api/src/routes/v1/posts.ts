import { Router } from "express";
import { CreatePostSchema } from "../../types";
import { db } from "../../db";
import { postTable } from "../../db/schema";
import authMiddleware from "../../middlewares/auth";
import { and, eq } from "drizzle-orm";

const router: Router = Router();
router.use(authMiddleware);
export default router;

router.post("/", async (req, res) => {
  const body = await CreatePostSchema.parseAsync(req.body);
  const post = await db
    .insert(postTable)
    .values({
      content: body.content,
      userId: res.locals["userId"],
    })
    .returning();
  res.status(201).json(post);
});

router.delete("/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const records = await db
    .delete(postTable)
    .where(
      and(eq(postTable.id, postId), eq(postTable.userId, res.locals["userId"])),
    )
    .returning();
  if (!records.length) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json({ message: "Post deleted successfully" });
});
