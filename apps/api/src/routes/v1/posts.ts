import { Router } from "express";
import { db } from "@/db";
import {
  attachmentTable,
  commentTable,
  likeTable,
  postTable,
  userTable,
} from "@/db/schema";
import authMiddleware from "@/middlewares/auth";
import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { z } from "zod";
import { CreateAttachmentSchema, UpdateDraftSchema } from "@/types";
import { CreateDraftPostResponse } from "@repo/api-types/post";
import { AttachmentFile } from "@repo/api-types";

const router: Router = Router();
router.use(authMiddleware);
export default router;

async function createRegularDraftPost(userId: number) {
  const existingDraft = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.userId, userId),
        eq(fields.published, false),
        eq(fields.postType, "regular"),
      ),
  });
  if (existingDraft) {
    return existingDraft;
  }
  const [post] = await db
    .insert(postTable)
    .values({
      userId,
      postType: "regular",
    })
    .returning();
  return post;
}

router.post("/", async (_req, res) => {
  const userId = res.locals["userId"];
  let draftPost;
  draftPost = await createRegularDraftPost(userId);
  const attachments = await db.query.attachmentTable.findMany({
    where: (fields, { eq }) => eq(fields.postId, draftPost.id),
  });
  res.status(200).json({
    ...draftPost,
    attachments,
  } as CreateDraftPostResponse);
  return;
});

router.post("/:postId/attachments", async (req, res) => {
  const data = await CreateAttachmentSchema.parseAsync(req.body);
  const postId = parseInt(req.params.postId);
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.id, postId),
        eq(fields.userId, res.locals["userId"]),
        eq(fields.published, false),
      ),
  });
  if (!draftPost) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  const [attachment] = await db
    .insert(attachmentTable)
    .values({
      postId: draftPost.id,
      userId: res.locals["userId"],
      url: data.url,
      assetId: data.assetId,
      publicId: data.publicId,
      type: data.type,
    })
    .returning();
  res.status(201).json(attachment as AttachmentFile);
});

router.patch("/:postId", async (req, res) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId);
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, postId), eq(fields.userId, userId)),
  });
  if (!draftPost) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  const body = await UpdateDraftSchema.parseAsync(req.body);
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "No fields to update" });
    return;
  }
  if (draftPost.published) {
    res.status(400).json({ message: "Draft post is already published" });
    return;
  }
  await db
    .update(postTable)
    .set({
      content: body.content,
    })
    .where(eq(postTable.id, postId));
  res.status(200).json({ message: "Draft post updated successfully" });
});

router.post("/:postId/publish", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, postId), eq(fields.userId, res.locals["userId"])),
  });
  if (!draftPost) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  if (draftPost.published) {
    res.status(400).json({ message: "Draft post is already published" });
    return;
  }
  await db
    .update(postTable)
    .set({ published: true, createdAt: new Date() })
    .where(eq(postTable.id, postId));
  res.status(200).json({ message: "Draft post published successfully" });
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
