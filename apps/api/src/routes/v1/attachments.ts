import { db } from "@/db";
import { attachmentTable } from "@/db/schema";
import authMiddleware from "@/middlewares/auth";
import { eq } from "drizzle-orm";
import { Router } from "express";

const router: Router = Router();
router.use(authMiddleware);
export default router;

router.delete("/:id", async (req, res) => {
  const attachmentId = parseInt(req.params.id, 10);
  const userId = res.locals["userId"];
  if (isNaN(attachmentId)) {
    res.status(400).json({ error: "Invalid attachment ID" });
    return;
  }

  const attachment = await db.query.attachmentTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, attachmentId),
  });

  if (!attachment) {
    res.status(404).json({ error: "Attachment not found" });
    return;
  }

  const post = await db.query.postTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, attachment.postId),
  });

  if (!post || post.published) {
    res
      .status(400)
      .json({ error: "Cannot delete attachment from published post" });
    return;
  }

  if (attachment.userId !== userId) {
    res
      .status(403)
      .json({ error: "You do not have permission to delete this attachment" });
    return;
  }

  try {
    await db
      .delete(attachmentTable)
      .where(eq(attachmentTable.id, attachmentId));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete attachment" });
  }
});
