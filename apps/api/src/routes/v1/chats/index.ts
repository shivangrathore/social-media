import { Router } from "express";
import { getChats, startChat } from "./controller";

const router: Router = Router();

router.get("/", getChats);
router.post("/start-chat", startChat);

export { router as chatRouter };
