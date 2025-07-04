import { Request, Response } from "express";
import { userRepository } from "@/data/repositories";
import { ServiceError } from "@/utils/errors";
import { User } from "@repo/types";

export const getCurrentUser = async (
  req: Request,
  res: Response<User>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const user = await userRepository.getById(userId);
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  res.json(user);
};
