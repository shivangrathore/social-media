import { Router } from "express";
import dateFns from "date-fns";
import { LoginSchema, RegisterSchema } from "../../types";
import { db } from "../../db";
import { accountTable, sessionTable, userTable } from "../../db/schema";
import { comparePassword, hashPassword } from "../../utils/crypto";
import { providers } from "../../auth_providers";
import { eq } from "drizzle-orm";
import { randomChars } from "../../utils/random";
import { signJWT } from "../../utils/jwt";
import { JWT_EXPIRE_TIME } from "../../data/constants";

const router: Router = Router();

router.post("/register", async (req, res) => {
  const body = await RegisterSchema.parseAsync(req.body);
  const hashedPassword = await hashPassword(body.password);
  await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(userTable)
      .values({
        email: body.email,
        name: body.name,
        username: body.username,
      })
      .returning({ id: userTable.id });
    await tx.insert(accountTable).values({
      userId: user!.id,
      provider: "credentials",
      providerAccountId: body.username,
      password: hashedPassword,
    });
  });
  res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const body = await LoginSchema.parseAsync(req.body);
  if (!body.username && !body.email) {
    res.status(400).json({ message: "Username or email is required" });
    return;
  }
  let matcher = (body.username || body.email)!;
  const user = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.username, matcher),
    with: {
      accounts: {
        limit: 1,
        where: (fields, { eq, and }) =>
          and(
            eq(fields.provider, "credentials"),
            eq(fields.userId, userTable.id),
          ),
      },
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const [userAccount] = user.accounts;
  if (!userAccount) {
    res.status(404).json({ message: "User account not found" });
    return;
  }
  const isPasswordMatch = await comparePassword(
    body.password,
    userAccount.password!,
  );

  if (!isPasswordMatch) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }
  const token = await signJWT(user.id);
  const expires = dateFns.add(new Date(), { seconds: JWT_EXPIRE_TIME });
  await db.insert(sessionTable).values({
    token,
    userId: user.id,
    expires,
  });
  res.cookie("token", token, { expires, httpOnly: true });
  res.status(200).json({ message: "User logged in successfully" });
});

router.get("/provider/:provider", async (req, res) => {
  const provider = providers[req.params.provider];
  if (!provider) {
    res.status(404).json({ message: "Provider not found" });
    return;
  }
  // TODO: Fix this state
  res.redirect(
    provider.oAuthUrl({ state: { redirectUrl: "http://localhost:3000" } }),
  );
});

router.get("/provider/:provider/callback", async (req, res) => {
  const provider = providers[req.params.provider];
  if (!provider) {
    res.status(404).json({ message: "Provider not found" });
    return;
  }
  const { code } = req.query;
  const { state: rawState } = req.query;
  const state = rawState ? JSON.parse(rawState as string) : null;
  if (!code) {
    res.status(400).json({ message: "Code is required" });
    return;
  }
  const providerUserToken = await provider.fetchToken(code as string);
  const providerUser = await provider.fetchUser(providerUserToken);
  if (!providerUser) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  let user = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.email, providerUser.email),
  });
  if (!user) {
    const newUser = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(userTable)
        .values({
          email: providerUser.email,
          name: providerUser.name,
          username: "user-" + randomChars(10),
        })
        .returning();
      if (!user) {
        throw new Error("User ID not found");
      }
      await tx
        .insert(accountTable)
        .values({
          userId: user.id,
          provider: provider.id,
          providerAccountId: providerUser.id,
          accessToken: providerUserToken,
        })
        .returning({ id: accountTable.id });
      return user;
    });
    if (!newUser) {
      res.status(500).json({ message: "User creation failed" });
      return;
    }
    user = newUser;
  } else {
    const existingAccount = await db.query.accountTable.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.provider, provider.id),
          eq(fields.providerAccountId, providerUser.id),
        ),
    });
    if (!existingAccount) {
      await db
        .insert(accountTable)
        .values({
          userId: user.id,
          provider: provider.id,
          providerAccountId: providerUser.id,
          accessToken: providerUserToken,
        })
        .returning({ id: accountTable.id });
    } else {
      await db
        .update(accountTable)
        .set({ accessToken: providerUserToken })
        .where(eq(accountTable.id, existingAccount.id));
    }
  }
  const token = await signJWT(user.id);
  const expires = dateFns.add(new Date(), { seconds: JWT_EXPIRE_TIME });
  await db.insert(sessionTable).values({
    token,
    userId: user.id,
    expires,
  });
  res.cookie("token", token, { expires, httpOnly: true });
  res.redirect(state.redirectUrl || "http://localhost:3000");
});

export default router;
