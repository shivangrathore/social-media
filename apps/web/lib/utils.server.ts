import { cookies } from "next/headers";
import { apiClient } from "./apiClient";

async function getAuthorizationHeader() {
  const ck = await cookies();
  const token = ck.get("token")?.value;
  return `Bearer ${token}`;
}

export async function fetchCurrentUser() {
  try {
    var res = await apiClient.get("users/@me", {
      headers: { Authorization: await getAuthorizationHeader() },
    });
  } catch {
    return null;
  }
  return res.data;
}
