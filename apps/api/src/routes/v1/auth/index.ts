import { Router } from "express";
import {
  login,
  logout,
  providerCallback,
  providerRedirect,
  register,
} from "./controller";
import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/provider/:provider", providerRedirect);
router.get("/provider/:provider/callback", providerCallback);
router.get("/logout", authMiddleware, logout);

export { router as authRouter };
