import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import { db } from "../../db";
import { profileTable } from "../../db/schema";

const router: Router = Router();
export default router;

router.post("/", authMiddleware, async (req, res) => {
  const userId = res.locals["userId"];
  const [profile] = await db
    .insert(profileTable)
    .values({
      userId,
      username: req.body.username || null,
      bio: req.body.bio || null,
      location: req.body.location || null,
      name: req.body.name || null,
      type: "page",
    })
    .returning();
  res.status(201).json(profile);
});
