// TODO: Make a separate service and repo for posts
import { Router } from "express";
import { db } from "@/db";
import {
  attachmentTable,
  commentTable,
  postTable,
  userBookmarkTable,
  userTable,
} from "@/db/schema";
import authMiddleware from "@/middlewares/auth";
import { and, eq, isNull, lt } from "drizzle-orm";
import { z } from "zod";
import { AddAttachmentSchema, UpdateDraftSchema } from "@/types";
import { AttachmentFile } from "@repo/api-types";
import { PostRepository } from "@/repositories/post.repository";
import { PostService } from "@/services/post.service";

const router: Router = Router();
router.use(authMiddleware);
export default router;

const postRepository = new PostRepository();
const postService = new PostService(postRepository);

router.post("/", async (_req, res) => {
  const userId = res.locals["userId"];
  const draftPost = await postService.CreateDraft(userId);
  res.json(draftPost);
});

router.post("/:draftId/attachments", async (req, res) => {
  const draftId = parseInt(req.params.draftId);
  if (isNaN(draftId)) {
    res.status(400).json({ message: "Invalid draft ID" });
    return;
  }
  const data = await AddAttachmentSchema.parseAsync(req.body);
  const userId = res.locals["userId"];
  const attachment = await postService.AddAttachment(draftId, userId, data);
  res.status(201).json(attachment);
});

router.patch("/:postId", async (req, res) => {
  const userId = res.locals["userId"];
  const body = await UpdateDraftSchema.parseAsync(req.body);
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "No fields to update" });
    return;
  }
  const updatedPost = await postService.UpdateDraftContent(
    userId,
    body.content!,
  );
  res.status(200).json(updatedPost);
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

router.post("/:postId/bookmark", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, postId), eq(fields.userId, userId)),
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const bookmark = await db.query.userBookmarkTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.targetId, postId),
        eq(fields.userId, userId),
        eq(fields.type, "post"),
      ),
  });
  if (bookmark) {
    res.status(400).json({ message: "Post already bookmarked" });
    return;
  }

  await db
    .insert(userBookmarkTable)
    .values({
      userId,
      targetId: postId,
      type: "post",
    })
    .returning();

  res.status(200).json({ message: "Post bookmarked successfully" });
});

router.delete("/:postId/bookmark", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, postId), eq(fields.userId, userId)),
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const bookmark = await db.query.userBookmarkTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.targetId, postId),
        eq(fields.userId, userId),
        eq(fields.type, "post"),
      ),
  });
  if (!bookmark) {
    res.status(400).json({ message: "Post is not bookmarked" });
    return;
  }

  await db
    .delete(userBookmarkTable)
    .where(
      and(
        eq(userBookmarkTable.targetId, postId),
        eq(userBookmarkTable.userId, userId),
        eq(userBookmarkTable.type, "post"),
      ),
    );

  res.status(200).json({ message: "Post unbookmarked successfully" });
});
