import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import { db } from "../../db";
import { attachmentTable, postTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UpdateDraftSchema } from "../../types";

const router: Router = Router();

router.use(authMiddleware);

router.post("/", async (_req, res) => {
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.userId, res.locals["userId"]), eq(fields.published, false)),
  });
  if (!draftPost) {
    const [post] = await db
      .insert(postTable)
      .values({
        userId: res.locals["userId"],
      })
      .returning();
    res.status(201).json({ ...post, attachments: [] });
    return;
  }
  const attachments = await db.query.attachmentTable.findMany({
    where: (fields, { eq }) => eq(fields.postId, draftPost.id),
  });
  res.status(200).json({ ...draftPost, attachments });
  return;
});

router.patch("/:draftId", async (req, res) => {
  const userId = res.locals["userId"];
  const draftId = parseInt(req.params.draftId);
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, draftId), eq(fields.userId, userId)),
  });
  if (!draftPost) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  const body = await UpdateDraftSchema.parseAsync(req.body);
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "No fields to update" });
    return;
  }
  if (draftPost.published) {
    res.status(400).json({ message: "Draft post is already published" });
    return;
  }
  await db
    .update(postTable)
    .set({
      content: body.content,
    })
    .where(eq(postTable.id, draftId));
  res.status(200).json({ message: "Draft post updated successfully" });
});

router.post("/:draftId/publish", async (req, res) => {
  const draftId = parseInt(req.params.draftId);
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, draftId), eq(fields.userId, res.locals["userId"])),
  });
  if (!draftPost) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  if (draftPost.published) {
    res.status(400).json({ message: "Draft post is already published" });
    return;
  }
  await db
    .update(postTable)
    .set({ published: true })
    .where(eq(postTable.id, draftId));
  res.status(200).json({ message: "Draft post published successfully" });
});

router.delete("/:draftId", async (req, res) => {
  const draftId = parseInt(req.params.draftId);
  const draftPost = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, draftId), eq(fields.userId, res.locals["userId"])),
  });
  if (!draftPost) {
    res.status(404).json({ message: "Draft post not found" });
    return;
  }
  await db.delete(postTable).where(eq(postTable.id, draftId));
  res.status(204).send();
});

export default router;
