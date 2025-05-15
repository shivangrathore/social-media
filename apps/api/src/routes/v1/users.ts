import { Router } from "express";
import { db } from "../../db";
import { friendRequestTable, userTable } from "../../db/schema";
import { verifyJWT } from "../../utils/jwt";
import authMiddleware from "../../middlewares/auth";

const router: Router = Router();

router.get("/:userId", async (req, res) => {
  const p_userId = req.params.userId;
  var user: typeof userTable.$inferSelect | undefined = undefined;
  if (p_userId == "@me") {
    const token = req.cookies["token"]!;
    const pay = await verifyJWT(token);
    const userId = pay.payload.sub!;
    user = await db.query.userTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, parseInt(userId)),
    });
  } else {
    user = await db.query.userTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, parseInt(p_userId)),
    });
  }
  res.json(user);
});

router.post<string, { userId: string }>(
  "/:userId/friend-requests",
  authMiddleware,
  async (req, res) => {
    const userId = res.locals["userId"];
    const t_userId = parseInt(req.params.userId);
    const result = await db.insert(friendRequestTable).values({
      senderId: userId,
      recipientId: t_userId,
    });
    if (result && result.rowCount && result.rowCount > 0)
      res.json({ message: "Friend request sent successfully" });
    else res.json({ message: "Request already pending" });
  },
);

export default router;
