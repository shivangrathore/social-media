import { Router } from "express";
import {
  addAttachment,
  addComment,
  createDraft,
  getAttachments,
  getDraft,
  getPoll,
  publishDraft,
  updateDraftContent,
  updateOptions,
} from "./controller";

const router: Router = Router();

router.get("/draft", getDraft);
router.post("/draft", createDraft);
router.get("/:postId/attachments", getAttachments);
router.post("/:postId/attachments", addAttachment);
router.patch("/:postId", updateDraftContent);
router.get("/:postId/poll", getPoll);
router.put("/:postId/poll/options", updateOptions);
router.post("/:postId/publish", publishDraft);
router.post("/:postId/comments", addComment);

export { router as postRouter };
