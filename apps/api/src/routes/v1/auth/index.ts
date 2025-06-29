import { Router } from "express";
import {
  login,
  providerCallback,
  providerRedirect,
  register,
} from "./controller";

const router: Router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/provider/:provider", providerRedirect);
router.get("/provider/:provider/callback", providerCallback);
