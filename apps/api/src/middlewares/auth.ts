import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies["token"];
  if (token) {
    try {
      const result = await verifyJWT(token);
      res.locals["userId"] = parseInt(result.payload.sub!);
    } catch {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}
