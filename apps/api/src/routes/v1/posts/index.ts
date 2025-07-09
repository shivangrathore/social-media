import { Router } from "express";
import {
  addAttachment,
  addComment,
  addLike,
  castVote,
  createDraft,
  getAttachments,
  getDraft,
  getPoll,
  logPostView,
  publishDraft,
  removeLike,
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
router.post("/:postId/likes", addLike);
router.delete("/:postId/likes", removeLike);
router.post("/:postId/views", logPostView);
router.post("/:postId/poll/vote", castVote);

export { router as postRouter };
