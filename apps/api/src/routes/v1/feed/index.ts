import { Router } from "express";
import { getUserFeed } from "./controller";

const router: Router = Router();

router.get("/", getUserFeed);

export { router as feedRouter };
