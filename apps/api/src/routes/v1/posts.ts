import { Router } from "express";
import { UpdatePostSchema } from "../../types";
import { db } from "../../db";
import {
  attachmentTable,
  commentTable,
  likeTable,
  postTable,
  userTable,
} from "../../db/schema";
import authMiddleware from "../../middlewares/auth";
import { and, asc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { z } from "zod";

const router: Router = Router();
router.use(authMiddleware);
export default router;

router.post("/", async (_req, res) => {
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq }) =>
      and(eq(fields.userId, res.locals["userId"]), eq(fields.published, false)),
  });
  if (draftPost) {
    res.status(200).json(draftPost);
    return;
  }
  const [post] = await db
    .insert(postTable)
    .values({
      userId: res.locals["userId"],
    })
    .returning();
  res.status(201).json(post);
});

router.get("/draft", async (req, res) => {
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq }) =>
      and(eq(fields.userId, res.locals["userId"]), eq(fields.published, false)),
  });
  if (!post) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  const attachments = await db.query.attachmentTable.findMany({
    where: (fields, { eq }) => eq(fields.postId, post.id),
  });
  res.json({ ...post, attachments });
});

router.patch("/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const body = await UpdatePostSchema.parseAsync(req.body);
  if (Object.keys(body).length == 0) {
    res.status(400).json({ message: "No fields to update" });
    return;
  }
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, postId),
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.userId !== res.locals["userId"]) {
    res
      .status(403)
      .json({ message: "You are not allowed to update this post" });
    return;
  }
  await db
    .update(postTable)
    .set({
      content: body.content,
    })
    .where(
      and(eq(postTable.id, postId), eq(postTable.userId, res.locals["userId"])),
    );
  res.json({ message: "Post updated successfully" });
});

router.post("/:postId/attachments", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];
  const body = req.body;
  await db.insert(attachmentTable).values({
    postId,
    userId,
    url: body.secure_url,
    asset_id: body.asset_id,
    public_id: body.public_id,
    width: body.width,
    height: body.height,
  });
  res.status(201).json({ message: "Attachment added successfully" });
});

const postPaginationCusor = z.number().optional();

// FIXME: Remove later on, we will implement a recommendation system
router.get("/", async (req, res) => {
  const cursor = await postPaginationCusor.parseAsync(req.query.cursor);
  const limit = 10;
  const posts = await db
    .select()
    .from(postTable)
    .where(cursor ? gt(postTable.id, cursor) : undefined)
    .limit(limit + 1)
    .innerJoin(userTable, eq(userTable.id, postTable.userId))
    .orderBy(asc(postTable.id));
  const data = posts.slice(0, limit);
  res.json({
    data,
    nextCursor: posts.length > limit ? data.at(-1)?.post.id : null,
  });
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
  const parentId = await z.coerce
    .number()
    .nullish()
    .default(null)
    .parseAsync(req.query.parentId);

  const [comment] = await db
    .insert(commentTable)
    .values({
      content,
      userId,
      postId,
      parentId,
    })
    .returning();

  res.status(201).json(comment);
});

router.get("/:postId/comments", async (req, res) => {
  const limit = 10;
  const postId = parseInt(req.params.postId);
  const cursor = await z.coerce
    .number()
    .optional()
    .parseAsync(req.query.cursor);
  const parentId = await z.coerce
    .number()
    .optional()
    .parseAsync(req.query.parentId);
  const post = await db
    .select({})
    .from(postTable)
    .where(eq(postTable.id, postId));
  if (post.length == 0) {
    res.status(400).json({ message: "Post not found" });
    return;
  }

  const comments = await db
    .select()
    .from(commentTable)
    .where(
      and(
        eq(commentTable.postId, postId),
        parentId
          ? eq(commentTable.parentId, parentId)
          : isNull(commentTable.parentId),
        cursor ? lt(commentTable.id, cursor) : undefined,
      ),
    )
    .innerJoin(userTable, eq(userTable.id, commentTable.userId))
    .limit(limit + 1);
  const data = comments.slice(0, limit);
  res.json({
    data,
    nextCursor: comments.length > limit ? data.at(-1)?.comment.id : null,
  });
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
