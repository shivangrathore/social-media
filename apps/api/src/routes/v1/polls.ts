import { Router } from "express";
import { db } from "../../db";
import {
  pollOptionTable,
  pollTable,
  pollVoteTable,
  postTable,
} from "../../db/schema";
import { CreatePollDraftResponse } from "@repo/api-types/poll";
import { CastVoteSchema, UpdatePollSchema } from "../../types";
import { and, eq, sql } from "drizzle-orm";
import authMiddleware from "../../middlewares/auth";

// Polls Router
const router: Router = Router();
router.use(authMiddleware);
export default router;

// TODO: Join poll_question and poll_option tables to get the poll data
async function createPollPost(userId: number) {
  const existingDraft = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.userId, userId),
        eq(fields.published, false),
        eq(fields.postType, "poll"),
      ),
  });
  if (existingDraft) {
    return existingDraft;
  }
  const [post] = await db
    .insert(postTable)
    .values({
      userId,
      postType: "poll",
    })
    .returning();
  return post;
}

async function getPoll(postId: number) {
  const poll = await db.query.pollTable.findFirst({
    where: (fields, { eq }) => eq(fields.postId, postId),
  });
  if (!poll) {
    return {
      question: null,
      options: [],
    };
  }
  const options = await db.query.pollOptionTable.findMany({
    where: (fields, { eq }) => eq(fields.pollId, poll.id),
  });
  return {
    question: poll.question,
    options,
  };
}

router.post("/", async (_req, res) => {
  const userId = res.locals["userId"];
  const post = await createPollPost(userId);
  const poll = await getPoll(post.id);
  const data: CreatePollDraftResponse = {
    id: post.id,
    userId: post.userId,
    postType: "poll",
    createdAt: post.createdAt,
    question: poll.question,
    options: poll.options.map((option) => option.option),
  };
  res.json(data);
});

router.patch("/:postId", async (req, res) => {
  const userId = res.locals["userId"];
  const draftId = parseInt(req.params.postId);
  const body = await UpdatePollSchema.parseAsync(req.body);

  const post = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, draftId), eq(fields.userId, userId)),
  });

  if (!post) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }

  if (post.published) {
    res.status(400).json({ message: "Draft post is already published" });
    return;
  }

  const [{ id: pollId }] = await db
    .insert(pollTable)
    .values({
      postId: post.id,
      question: body.question,
    })
    .onConflictDoUpdate({
      target: pollTable.postId,
      set: {
        question: body.question,
      },
    })
    .returning({ id: pollTable.id });

  await db.delete(pollOptionTable).where(eq(pollOptionTable.pollId, pollId));

  const options = body.options.map((option) => ({
    pollId,
    option,
  }));
  if (options.length > 0) {
    await db.insert(pollOptionTable).values(options);
  }
  res.json({
    message: "Poll updated successfully",
    postId: post.id,
    question: body.question,
    options: body.options,
  });
});

router.post("/:postId/publish", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.id, postId),
        eq(fields.published, false),
        eq(fields.postType, "poll"),
      ),
  });
  if (!post) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  const poll = await getPoll(postId);
  if (!poll) {
    res.status(404).json({ message: "Poll not found" });
    return;
  }
  if (!poll.question || poll.options.length < 2) {
    res.status(400).json({
      message: "Poll must have a question and at least two options",
    });
    return;
  }

  await db
    .update(postTable)
    .set({ published: true })
    .where(eq(postTable.id, postId));

  res.json({
    question: poll.question,
    options: poll.options.map((option) => option.option),
  });
});

// FIXME: Implement voting logic
router.post("/:postId/vote", async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = res.locals["userId"];
  const { optionId } = await CastVoteSchema.parseAsync(req.body);
  const post = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, postId), eq(fields.published, true)),
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  const poll = await db.query.pollTable.findFirst({
    where: (fields, { eq }) => eq(fields.postId, postId),
  });
  if (!poll) {
    res.status(404).json({ message: "Poll not found" });
    return;
  }
  const option = await db.query.pollOptionTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, optionId), eq(fields.pollId, poll.id)),
  });

  if (!option) {
    res.status(404).json({ message: "Option not found" });
    return;
  }

  const [oldOption] = await db
    .delete(pollVoteTable)
    .where(
      and(eq(pollVoteTable.userId, userId), eq(pollVoteTable.pollId, poll.id)),
    )
    .returning({ id: pollVoteTable.pollOptionId });

  if (oldOption) {
    await db
      .update(pollOptionTable)
      .set({
        votes: sql`${pollOptionTable.votes} - 1`,
      })
      .where(eq(pollOptionTable.id, oldOption.id));
  }

  await db.insert(pollVoteTable).values({
    pollId: poll.id,
    userId,
    pollOptionId: option.id,
  });

  await db
    .update(pollOptionTable)
    .set({ votes: sql`${pollOptionTable.votes}+ 1` })
    .where(eq(pollOptionTable.id, option.id));

  res.json({ message: "Vote cast successfully" });
});
