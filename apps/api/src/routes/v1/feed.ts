import { Router } from "express";
import { z } from "zod";
import { FeedRepository } from "@/repositories/feed.repository";
import { FeedService } from "@/services/feed.service";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();
router.use(authMiddleware);
export default router;

const feedQuerySchema = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().default(10),
});
const feedRepository = new FeedRepository();
const feedService = new FeedService(feedRepository);

router.get("/", async (req, res) => {
  const parsedQuery = await feedQuerySchema.parseAsync(req.query);
  const data = await feedService.getFeed(
    res.locals["userId"],
    parsedQuery.cursor,
    parsedQuery.limit,
  );
  res.json(data);
});
