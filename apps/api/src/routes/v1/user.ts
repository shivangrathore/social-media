import { Router } from "express";
import { db } from "../../db";
import { userTable } from "../../db/schema";
import { verifyJWT } from "../../utils/jwt";

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

export default router;
