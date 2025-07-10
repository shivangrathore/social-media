import { Router } from "express";
import { searchHashtags } from "./controller";

const router: Router = Router();
router.get("/search", searchHashtags);

export { router as hashtagsRouter };
