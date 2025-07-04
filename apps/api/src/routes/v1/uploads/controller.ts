import config from "@/config";
import { generateSignature } from "@/utils/cloudinary";
import { GetSignatureResponse } from "@repo/types";
import { Request, Response } from "express";

export async function getSignature(
  req: Request,
  res: Response<GetSignatureResponse>,
): Promise<void> {
  const { type = "image", ...rest } = req.body;
  const userId = res.locals["userId"];
  const data = await generateSignature(userId, rest);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/upload`;
  res.json({ ...data, uploadUrl });
}
