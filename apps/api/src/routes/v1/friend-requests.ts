import { Request, Response, Router } from "express";
import { db } from "../../db";
import authMiddleware from "../../middlewares/auth";
import { z } from "zod";
import { friendRequestTable, friendTable, userTable } from "../../db/schema";
import { and, asc, eq, gt } from "drizzle-orm";

const router: Router = Router();
export default router;

const friendRequestCursor = z.number().optional();

async function getFriendRequests(
  userId: number,
  role: "sender" | "recipient",
  cursor?: number,
  limit: number = 10,
) {
  const columnCurrentUser = role == "sender" ? "senderId" : "recipientId";
  const columnOtherUser = role == "sender" ? "recipientId" : "senderId";
  const requests = await db
    .select()
    .from(friendRequestTable)
    .where(
      and(
        eq(friendRequestTable[columnCurrentUser], userId),
        eq(friendRequestTable.status, "pending"),
        cursor ? gt(friendRequestTable.id, cursor) : undefined,
      ),
    )
    .limit(limit + 1)
    .orderBy(asc(friendRequestTable.id))
    .innerJoin(
      userTable,
      eq(userTable.id, friendRequestTable[columnOtherUser]),
    );
  const data = requests.slice(0, 10);
  return {
    data,
    nextCursor: requests.length > 10 ? data.at(-1)?.friend_request.id : null,
  };
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

async function validateRequestAccess(req: Request, res: Response) {
  const p_requestId = parseInt(req.params.requestId!);
  const userId = res.locals["userId"];
  const request = await db.query.friendRequestTable.findFirst({
    where: (t, { eq, and }) =>
      and(eq(t.id, p_requestId), eq(t.status, "pending")),
  });
  if (!request) {
    res.status(404).json({ message: "Request not found" });
    return null;
  }

  if (userId != request.recipientId) {
    res.status(403).json({ message: "You can't act on this request" });
    return null;
  }

  return { request, p_requestId, userId };
}

router.post("/:requestId/accept", authMiddleware, async (req, res) => {
  const result = await validateRequestAccess(req, res);
  if (!result) return;
  const { request } = result;
  const [user1Id, user2Id] = [request.recipientId, request.senderId].sort() as [
    number,
    number,
  ];

  await db.transaction(async (tx) => {
    await tx.update(friendRequestTable).set({
      status: "accepted",
    });
    await tx.insert(friendTable).values({
      user1Id,
      user2Id,
    });
  });

  res.json({ message: "Request accepted successfully" });
});

router.post("/:requestId/reject", authMiddleware, async (req, res) => {
  const result = await validateRequestAccess(req, res);
  if (!result) return;
  await db.update(friendRequestTable).set({
    status: "rejected",
  });
  res.json({ message: "Request rejectected successfully" });
});
