import { Router } from "express";
import { generateSignature } from "@/utils/cloudinary";
import authMiddleware from "@/middlewares/auth";
import config from "@/config";
import { db } from "@/db";
import { attachmentTable } from "@/db/schema";
import express from "express";
import crypto from "crypto";

const router: Router = Router();
export default router;

// TODO: Export context function for client
router.post("/signature", express.json(), authMiddleware, async (req, res) => {
  const { type = "image", ...rest } = req.body;
  const data = await generateSignature(res.locals["userId"], rest);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/upload`;
  res.json({ ...data, uploadUrl });
});

// Cloudinary webhook notification endpoint
router.post(
  "/cloudinary-notification",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const rawBody = req.body;
    const body = JSON.parse(rawBody.toString("utf-8"));
    const context = body.context?.custom || {};
    const postId = parseInt(context.postId);
    const userId = parseInt(context.userId);
    const cldTimestamp = req.headers["x-cld-timestamp"];
    const cldSignature = req.headers["x-cld-signature"];
    const generateSignature = crypto
      .createHash("sha1")
      .update(
        rawBody.toString("utf-8") + cldTimestamp + config.CLOUDINARY_API_SECRET,
      )
      .digest("hex");
    if (generateSignature !== cldSignature) {
      res.status(403).json({ error: "Invalid signature" });
      return;
    }
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
  },
);
