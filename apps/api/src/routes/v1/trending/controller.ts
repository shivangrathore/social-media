import { hashtagRepository } from "@/data/repositories";
import { redis } from "@/db/redis";
import { TrendingTag } from "@repo/types";
import { Request, Response } from "express";

export async function getTrendingTags(
  req: Request,
  res: Response<TrendingTag[]>,
): Promise<void> {
  const data = await redis.zrevrange("trending_hashtags", 0, 9, "WITHSCORES");
  const tags: TrendingTag[] = [];

  for (let i = 0; i < data.length; i += 2) {
    const tag = data[i];
    tags.push({ tag, postCount: 0 });
  }

  for (const tag of tags) {
    const htag = await hashtagRepository.getByName(tag.tag);
    if (htag) {
      tag.postCount = htag.postCount;
    }
  }

  res.json(tags);
}
