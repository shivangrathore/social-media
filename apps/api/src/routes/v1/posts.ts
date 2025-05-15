import { Router } from "express";
import { CreatePostSchema } from "../../types";
import { db } from "../../db";
import { commentTable, likeTable, postTable } from "../../db/schema";
import authMiddleware from "../../middlewares/auth";
import { and, eq, sql } from "drizzle-orm";

const router: Router = Router();
router.use(authMiddleware);
export default router;

router.post("/", async (req, res) => {
  const body = await CreatePostSchema.parseAsync(req.body);
  const [post] = await db
    .insert(postTable)
    .values({
      content: body.content,
      userId: res.locals["userId"],
    })
    .returning();
  res.status(201).json(post);
});

router.get("/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, postId),
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.json(post);
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

router.post("/:postId/comments", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const { content } = req.body;
  const userId = res.locals["userId"];

  const [comment] = await db
    .insert(commentTable)
    .values({
      content,
      userId,
      postId,
    })
    .returning();

  res.status(201).json(comment);
});

router.post("/:postId/likes", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];

  const like = await db.transaction(async (tx) => {
    const [like] = await tx
      .insert(likeTable)
      .values({
        targetId: postId,
        userId,
        targetType: "post",
      })
      .returning();
    await tx
      .update(postTable)
      .set({ numLikes: sql`${postTable.numLikes} + 1` })
      .where(eq(postTable.id, postId));
    return like;
  });

  res.status(201).json(like);
});

router.delete("/:postId/likes", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];

  const like = await db.transaction(async (tx) => {
    const [like] = await tx
      .delete(likeTable)
      .where(
        and(
          eq(likeTable.userId, userId),
          eq(likeTable.targetId, postId),
          eq(likeTable.targetType, "post"),
        ),
      )
      .returning();
    if (!like) return;
    await tx
      .update(postTable)
      .set({ numLikes: sql`${postTable.numLikes} - 1` })
      .where(eq(postTable.id, postId));
    return like;
  });

  res.status(201).json(like);
});
