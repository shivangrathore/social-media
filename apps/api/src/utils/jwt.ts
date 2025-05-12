import jose from "jose";
import config from "../config";

export async function signJWT(userId: number) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  return await new jose.SignJWT()
    .setSubject(userId.toString())
    .setIssuedAt()
    .setIssuer("social-media")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
}

export async function verifyJWT(jwt: string) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  return await jose.jwtVerify(jwt, secret);
}
