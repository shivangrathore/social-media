import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import { db } from "../../db";
import { postTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UpdateDraftSchema } from "../../types";
import { CreateDraftPostResponse } from "@repo/api-types/post";

const router: Router = Router();

router.use(authMiddleware);

async function createRegularDraftPost(userId: number) {
  const existingDraft = await db.query.postTable.findFirst({
    where: (fields, { eq, and }) =>
      and(
        eq(fields.userId, userId),
        eq(fields.published, false),
        eq(fields.postType, "regular"),
      ),
  });
  if (existingDraft) {
    return existingDraft;
  }
  const [post] = await db
    .insert(postTable)
    .values({
      userId,
      postType: "regular",
    })
    .returning();
  return post;
}

router.post("/", async (_req, res) => {
  const userId = res.locals["userId"];
  let draftPost;
  draftPost = await createRegularDraftPost(userId);
  const attachments = await db.query.attachmentTable.findMany({
    where: (fields, { eq }) => eq(fields.postId, draftPost.id),
  });
  console.log(attachments);
  res.status(200).json({
    ...draftPost,
    attachments,
  } as CreateDraftPostResponse);
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
