import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import {
  attachmentTable,
  pollOptionTable,
  pollTable,
  pollVoteTable,
  postTable,
  profileTable,
  userTable,
} from "../../db/schema";
import { and, desc, eq, gt } from "drizzle-orm";
import { FeedEntry, FeedResponse } from "@repo/api-types/feed";

const router: Router = Router();
export default router;
const feedPaginationCursor = z.number().optional();

// FIXME: Remove later on, we will implement a recommendation system
// TODO: Take these query parameters into account
// TODO: Refactor
router.get("/", async (req, res) => {
  const cursor = await feedPaginationCursor.parseAsync(req.query.cursor);
  const limit = 10;
  const records = await db
    .select({
      post: postTable,
      user: {
        id: userTable.id,
        username: profileTable.username,
        avatar: userTable.avatar,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
      },
    })
    .from(postTable)
    .where(
      and(
        cursor ? gt(postTable.id, cursor) : undefined,
        eq(postTable.published, true),
      ),
    )
    .limit(limit + 1)
    .orderBy(desc(postTable.createdAt))
    .innerJoin(userTable, eq(userTable.id, postTable.userId))
    .innerJoin(profileTable, eq(profileTable.userId, userTable.id)); // TODO: Create an index on createdAt for performance
  const data: FeedEntry[] = await Promise.all(
    records.slice(0, limit).map(async (record) => {
      const post = record.post;
      const author = record.user;
      if (post.postType === "poll") {
        const [poll] = await db
          .select()
          .from(pollTable)
          .where(eq(pollTable.postId, post.id));
        const options = await db
          .select()
          .from(pollOptionTable)
          .where(eq(pollOptionTable.pollId, poll.id));
        const [selectedOption] = await db
          .select()
          .from(pollVoteTable)
          .where(
            and(
              eq(pollVoteTable.pollId, poll.id),
              eq(pollVoteTable.userId, post.userId),
            ),
          );
        const entry: FeedEntry = {
          id: post.id,
          createdAt: post.createdAt,
          userId: post.userId,
          postType: "poll",
          question: poll.question,
          author,
          options: options.map((option) => ({
            id: option.id,
            option: option.option,
            votes: option.votes,
          })),
          selectedOption: selectedOption ? selectedOption.pollOptionId : null,
        };
        return entry;
      } else {
        const attachments = await db
          .select()
          .from(attachmentTable)
          .where(eq(attachmentTable.postId, post.id));

        const entry: FeedEntry = {
          id: post.id,
          createdAt: post.createdAt,
          userId: post.userId,
          postType: "regular",
          content: post.content,
          author,
          attachments: attachments.map((attachment) => ({
            id: attachment.id,
            height: attachment.height,
            width: attachment.width,
            asset_id: attachment.asset_id,
            resource_type: attachment.resource_type,
            url: attachment.url,
            postId: attachment.postId,
            userId: attachment.userId,
            public_id: attachment.public_id,
          })),
        };
        return entry;
      }
    }),
  );
  res.json({
    data,
    nextCursor: records.length > limit ? records.at(-1)!.post.id : null,
  } as FeedResponse);
});
