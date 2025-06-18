import { Router } from "express";
import { db } from "../../db";
import {
  attachmentTable,
  commentTable,
  likeTable,
  postTable,
  profileTable,
  userTable,
} from "../../db/schema";
import authMiddleware from "../../middlewares/auth";
import { and, asc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { z } from "zod";
import { GetPostsResponse } from "@repo/api-types/post";

const router: Router = Router();
router.use(authMiddleware);
export default router;

const postPaginationCusor = z.number().optional();

// FIXME: Remove later on, we will implement a recommendation system
router.get("/", async (req, res) => {
  const cursor = await postPaginationCusor.parseAsync(req.query.cursor);
  const limit = 10;
  const posts = await db
    .select({
      post: postTable,
      user: {
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        username: profileTable.username,
        avatar: userTable.avatar,
        createdAt: userTable.createdAt,
      },
    })
    .from(postTable)
    .innerJoin(userTable, eq(userTable.id, postTable.userId))
    .innerJoin(profileTable, eq(profileTable.userId, userTable.id))
    .where(
      and(
        cursor ? gt(postTable.id, cursor) : undefined,
        eq(postTable.published, true),
      ),
    )
    .limit(limit + 1)
    .orderBy(asc(postTable.id));
  const data = await Promise.all(
    posts.slice(0, limit).map(async (post) => {
      const attachments = await db
        .select()
        .from(attachmentTable)
        .where(eq(attachmentTable.postId, post.post.id));
      return {
        post: { ...post.post, attachments },
        user: post.user,
      };
    }),
  );
  res.json({
    data,
    nextCursor: posts.length > limit ? data.at(-1)?.post.id : null,
  } as GetPostsResponse);
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
