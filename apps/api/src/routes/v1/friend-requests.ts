import { Router } from "express";
import { db } from "../../db";
import authMiddleware from "../../middlewares/auth";
import { z } from "zod";

const router: Router = Router();
export default router;

const friendRequestCursor = z.number().optional();

async function getFriendRequests(
  userId: number,
  role: "sender" | "recipient",
  cursor?: number,
  limit: number = 10,
) {
  const column = role == "sender" ? "senderId" : "recipientId";
  const requests = await db.query.friendRequestTable.findMany({
    where: (t, { eq, and, gt }) =>
      and(
        eq(t[column], userId),
        eq(t.status, "pending"),
        cursor ? gt(t.id, cursor) : undefined,
      ),
    orderBy: (t, { asc }) => asc(t.id),
    limit: limit + 1,
  });
  const data = requests.slice(0, 10);
  return { data, nextPage: requests.length > 10 ? data.at(-1)?.id : null };
}

router.get("/incoming", authMiddleware, async (req, res) => {
  const userId = res.locals["userId"];
  const cursor = await friendRequestCursor.parseAsync(req.query["cursor"]);
  const data = await getFriendRequests(userId, "recipient", cursor);
  res.json(data);
});

router.get("/outgoing", authMiddleware, async (req, res) => {
  const userId = res.locals["userId"];
  const cursor = await friendRequestCursor.parseAsync(req.query["cursor"]);
  const data = await getFriendRequests(userId, "sender", cursor);
  res.json(data);
});

router.post("/:requestId/accept", async (req, res) => {});
router.post("/:requestId/reject", async (req, res) => {});
