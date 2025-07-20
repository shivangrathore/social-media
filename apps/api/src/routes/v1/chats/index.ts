import { Router } from "express";
import {
  getChats,
  createChat,
  getChat,
  createMessage,
  getMessages,
} from "./controller";

const router: Router = Router();

router.get("/", getChats);
router.get("/:chatId", getChat);
router.post("/", createChat);
router.post("/:chatId/messages", createMessage);
router.get("/:chatId/messages", getMessages);

export { router as chatRouter };
