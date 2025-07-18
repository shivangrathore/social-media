import { Request, Response } from "express";
export async function getChats(req: Request, res: Response) {
  res.json([]);
}

export async function startChat(req: Request, res: Response) {
  const { chatId } = req.body;
  if (!chatId) {
    res.status(400).json({ error: "Chat ID is required" });
    return;
  }
  res.json({ message: `Chat ${chatId} started successfully` });
}
