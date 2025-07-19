import { Router } from "express";
import { getChats, createChat, getChat } from "./controller";

const router: Router = Router();

router.get("/", getChats);
router.get("/:chatId", getChat);
router.post("/", createChat);

export { router as chatRouter };
