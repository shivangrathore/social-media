import { Router } from "express";
import { generateSignature } from "../../utils/cloudinary";
import authMiddleware from "../../middlewares/auth";

const router: Router = Router();
export default router;

router.post("/signature", authMiddleware, async (req, res) => {
  const data = await generateSignature(res.locals["userId"], req.body);
  res.json(data);
});
