import { Router } from "express";
import { generateSignature } from "../../utils/cloudinary";
import authMiddleware from "../../middlewares/auth";
import config from "../../config";

const router: Router = Router();
export default router;

router.post("/signature", authMiddleware, async (req, res) => {
  const data = await generateSignature(res.locals["userId"], req.body);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/image/upload`;
  res.json({ ...data, uploadUrl });
});

// Cloudinary webhook notification endpoint
router.post("/cloudinary-notification", async (req, res) => {
  console.log("Cloudinary notification received:", req.query);
  console.log(req.body);
});
