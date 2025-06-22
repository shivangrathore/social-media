import { Router } from "express";
import { db } from "@/db";
import {
  friendRequestTable,
  friendTable,
  profileTable,
  userTable,
} from "@/db/schema";
import authMiddleware from "@/middlewares/auth";
import { and, eq, or } from "drizzle-orm";
import * as dateFns from "date-fns";

const router: Router = Router();

router.get("/:userId", authMiddleware, async (req, res) => {
  const p_userId = req.params.userId;
  let userId: number;
  if (p_userId == "@me") {
    userId = res.locals["userId"];
  } else {
    userId = parseInt(p_userId);
  }
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const [user] = await db
    .select({
      id: userTable.id,
      username: profileTable.username,
      email: userTable.email,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .innerJoin(profileTable, eq(profileTable.userId, userTable.id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

router.post<string, { userId: string }>(
  "/:userId/friend-requests",
  authMiddleware,
  async (req, res) => {
    const userId = res.locals["userId"];
    const t_userId = parseInt(req.params.userId);
    const [exists] = await db
      .select()
      .from(friendRequestTable)
      .where(
        and(
          eq(friendRequestTable.senderId, userId),
          eq(friendRequestTable.recipientId, t_userId),
        ),
      );
    if (exists) {
      switch (exists.status) {
        case "pending":
          res.status(400).json({ message: "A request is already pending" });
          return;
        case "rejected":
          if (new Date() < dateFns.addDays(exists.updatedAt!, 7)) {
            res.status(400).json({
              message: "You have to wait before trying to resend a request",
            });
            return;
          }
          await db.update(friendRequestTable).set({
            status: "pending",
          });
          res.json({ message: "Friend request sent successfully" });
          return;
        case "accepted":
          res
            .status(400)
            .json({ message: "You are already friend with that user" });
          return;
      }
    } else {
      await db.insert(friendRequestTable).values({
        senderId: userId,
        recipientId: t_userId,
      });
      res.json({ message: "Friend request sent successfully" });
    }
  },
);

router.get("/@me/friends", authMiddleware, async (req, res) => {
  const userId = res.locals["userId"];
  const friends = await db
    .select()
    .from(friendTable)
    .innerJoin(
      userTable,
      or(
        and(
          eq(friendTable.user1Id, userId),
          eq(userTable.id, friendTable.user2Id),
        ),
        and(
          eq(friendTable.user2Id, userId),
          eq(userTable.id, friendTable.user1Id),
        ),
      ),
    )
    .limit(10);

  res.json({ data: friends });
});

export default router;
