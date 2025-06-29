import { authRepository } from "@/data/repositories";
import {
  RegisterUserSchema,
  LoginUserSchema,
  LoginUserSchemaType,
} from "@repo/request-schemas";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "@/utils/crypto";
import { ServiceError } from "@/utils/errors";
import { signJWT } from "@/utils/jwt";
import * as dateFns from "date-fns";
import { JWT_EXPIRE_TIME } from "@/data/constants";
import { usernameFromName } from "@/utils/db";
import { providers } from "@/auth_providers";
import { z } from "zod";
import { IUser, LoginResponse, RegisterResponse } from "@repo/types";

const ProviderCallbackQuery = z.object({
  code: z.string(),
  state: z.string().transform((arg, ctx) => {
    try {
      return JSON.parse(arg) as { redirectUrl?: string };
    } catch (e) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid type of state, expected json",
      });
    }
  }),
});

async function createSession(res: Response, user: IUser): Promise<void> {
  const token = await signJWT(user.id);
  const expires = dateFns.add(new Date(), { seconds: JWT_EXPIRE_TIME });
  await authRepository.createSession(user.id, token, expires);
  res.cookie("token", token, { expires, httpOnly: true });
}

export const login = async (
  req: Request,
  res: Response<LoginResponse>,
): Promise<void> => {
  let user: IUser | null = null;
  const payload = await LoginUserSchema.parseAsync(req.body);
  user = await authRepository.findUserByUsername(payload.id);
  if (!user) {
    user = await authRepository.findUserByEmail(payload.id);
  }
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  const account = await authRepository.findAccountByUserId(
    user.id,
    "credentials",
  );
  if (!account) {
    throw ServiceError.Unauthorized("Invalid credentials");
  }
  if (!(await comparePassword(payload.password, account.password!))) {
    throw ServiceError.Unauthorized("Invalid credentials");
  }
  await createSession(res, user);
  res.status(200).json({
    message: "Login successful",
    user,
  });
};

export const register = async (
  req: Request,
  res: Response<RegisterResponse>,
): Promise<void> => {
  const payload = await RegisterUserSchema.parseAsync(req.body);
  const hashedPassword = await hashPassword(payload.password);
  const username = usernameFromName(payload.name);
  await authRepository.register(payload, username, hashedPassword);
  res.status(201).json({
    message: "Register successful",
  });
};

export const providerRedirect = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const provider = providers[req.params.provider];
  if (!provider) {
    throw ServiceError.BadRequest("Provider not found");
  }
  const redirectUrl = req.query.redirectUrl;
  res.redirect(provider.oAuthUrl({ state: { redirectUrl } }));
};

export const providerCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code, state } = await ProviderCallbackQuery.parseAsync(req.query);
  const provider = providers[req.params.provider];
  if (!provider) {
    throw ServiceError.BadRequest("Provider not found");
  }
  const token = await provider.fetchToken(code);
  const providerUser = await provider.fetchUser(token);
  const username = usernameFromName(providerUser.name);
  const user = await authRepository.registerWithProvider(
    providerUser,
    token,
    username,
    provider.id,
  );
  await createSession(res, user);
  if (state?.redirectUrl) {
    res.redirect(state.redirectUrl);
  }
  res.status(200).json({
    message: "Login successful",
    user,
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // await authRepository.deleteSession(token);
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
};
