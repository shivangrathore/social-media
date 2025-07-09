import { db } from "@/db";
import { IPollData, IPollOption, IPollRepository } from "./respository";
import { pollOptionTable, pollTable, pollVoteTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { PollMeta } from "@repo/types";
import { ServiceError } from "@/utils/errors";

export class PollRepository implements IPollRepository {
  async createPoll(postId: number, expiresAt?: Date): Promise<void> {
    await db.insert(pollTable).values({
      postId,
      expiresAt: expiresAt ?? null,
    });
  }

  async setOptions(postId: number, options: string[]): Promise<void> {
    const poll = await db.query.pollTable.findFirst({
      where: (table) => eq(table.postId, postId),
    });

    if (!poll) {
      throw new Error("Poll not found for the given post ID");
    }
    await db.delete(pollOptionTable).where(eq(pollOptionTable.pollId, poll.id));
    const values = options.map((option) => ({
      pollId: poll.id,
      text: option,
    }));
    await db.insert(pollOptionTable).values(values);
  }

  async getPollMeta(postId: number): Promise<PollMeta | null> {
    const poll = await db.query.pollTable.findFirst({
      where: (table) => eq(table.postId, postId),
      columns: {
        id: true,
        expiresAt: true,
      },
    });

    if (!poll) {
      return null;
    }

    const options = await db.query.pollOptionTable.findMany({
      where: (table) => eq(table.pollId, poll.id),
      columns: {
        text: true,
      },
    });

    return {
      id: poll.id,
      options: options.map((opt) => opt.text),
      expiresAt: poll.expiresAt,
    };
  }

  async getOptionById(optionId: number): Promise<IPollOption | null> {
    const result = await db.query.pollOptionTable.findFirst({
      where: (table) => eq(table.id, optionId),
    });
    if (!result) {
      return null;
    }
    return result;
  }

  async createVote(
    userId: number,
    pollId: number,
    optionId: number,
  ): Promise<IPollOption> {
    const updatedOption = await db.transaction(async (tx) => {
      const existingVote = await tx.query.pollVoteTable.findFirst({
        where: (table) =>
          and(eq(table.pollId, pollId), eq(table.userId, userId)),
      });
      if (existingVote) {
        await tx
          .update(pollOptionTable)
          .set({
            voteCount: sql`${pollOptionTable.voteCount} - 1`,
          })
          .where(eq(pollOptionTable.id, existingVote.pollOptionId));
        await tx
          .delete(pollVoteTable)
          .where(and(eq(pollVoteTable.id, existingVote.id)));
      }
      const [updated] = await tx
        .update(pollOptionTable)
        .set({
          voteCount: sql`${pollOptionTable.voteCount} + 1`,
        })
        .where(eq(pollOptionTable.id, optionId))
        .returning();

      await tx.insert(pollVoteTable).values({
        userId,
        pollId,
        pollOptionId: optionId,
      });

      return updated;
    });

    return updatedOption;
  }

  async getPollByPostId(postId: number): Promise<IPollData | null> {
    const poll = await db.query.pollTable.findFirst({
      where: (table) => eq(table.postId, postId),
      columns: {
        id: true,
        postId: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    if (!poll) {
      return null;
    }

    return {
      id: poll.id,
      postId: poll.postId,
      expiresAt: poll.expiresAt,
      createdAt: poll.createdAt,
    };
  }
}
