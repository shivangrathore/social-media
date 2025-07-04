import { db } from "@/db";
import { IPollRepository } from "./respository";
import { pollOptionTable, pollTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PollMeta } from "@repo/types";

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
      option,
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
        option: true,
      },
    });

    return {
      options: options.map((opt) => opt.option),
      expiresAt: poll.expiresAt,
    };
  }
}
