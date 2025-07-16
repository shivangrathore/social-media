import { Router } from "express";
import { getTrendingTags } from "./controller";

const router: Router = Router();

router.get("/tags", getTrendingTags);

export { router as trendingRouter };
