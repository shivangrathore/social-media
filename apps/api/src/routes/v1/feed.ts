import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import {
  attachmentTable,
  postTable,
  profileTable,
  userTable,
} from "../../db/schema";
import { and, asc, eq, gt } from "drizzle-orm";
import { GetPostsResponse } from "@repo/api-types/post";

const router: Router = Router();
export default router;
const feedPaginationCursor = z.number().optional();

// FIXME: Remove later on, we will implement a recommendation system
router.get("/", async (req, res) => {
  const cursor = await feedPaginationCursor.parseAsync(req.query.cursor);
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
