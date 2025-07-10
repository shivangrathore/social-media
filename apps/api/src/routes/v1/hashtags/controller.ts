import { hashtagRepository } from "@/data/repositories";
import { Hashtag } from "@repo/types";
import { Request, Response } from "express";

export async function searchHashtags(req: Request, res: Response<Hashtag[]>) {
  const hashtags = await hashtagRepository.searchByName(
    req.query.query as string,
    5,
  );
  res.status(200).json(hashtags);
}
