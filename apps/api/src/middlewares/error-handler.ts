import { ServiceError } from "@/utils/errors";
import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof ServiceError) {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.statusCode,
    });
    return;
  }
  res.status(500).json({
    message: "Internal Server Error",
    status: 500,
  });
}
