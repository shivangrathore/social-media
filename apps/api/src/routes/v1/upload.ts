import { Router } from "express";
import { generateSignature } from "../../utils/cloudinary";
import authMiddleware from "../../middlewares/auth";
import config from "../../config";
import { db } from "../../db";
import { attachmentTable } from "../../db/schema";

const router: Router = Router();
export default router;

// TODO: Export context function for client
router.post("/signature", authMiddleware, async (req, res) => {
  const data = await generateSignature(res.locals["userId"], req.body);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/image/upload`;
  res.json({ ...data, uploadUrl });
});

// Cloudinary webhook notification endpoint
router.post("/cloudinary-notification", async (req, res) => {
  const body = req.body as Record<string, any>;
  const context = body.context?.custom || {};
  const postId = parseInt(context.postId);
  const userId = parseInt(context.userId);
  console.log(body);
  if (!postId || isNaN(postId)) {
    res.status(400).json({ error: "Missing postId in context" });
    // TODO: Delete the file from Cloudinary
    return;
  }
  if (!userId || isNaN(userId)) {
    res.status(400).json({ error: "Missing userId in context" });
    return;
  }
  await db.insert(attachmentTable).values({
    postId,
    userId,
    url: body.secure_url,
    asset_id: body.asset_id,
    public_id: body.public_id,
    width: body.width,
    height: body.height,
    resource_type: body.resource_type,
  });

  res.status(200).json({ success: true });
});
