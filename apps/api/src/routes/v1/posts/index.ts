import { Router } from "express";
import {
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

router.get("/", getDraft);
router.post("/", createDraft);
router.get("/:postId/attachments", getAttachments);
router.patch("/:postId", updateDraftContent);
router.get("/:postId/poll", getPoll);
router.post("/:postId/poll/options", updateOptions);
router.post("/:postId/publish", publishDraft);
router.post("/:postId/comments", addComment);

export { router as postRouter };
