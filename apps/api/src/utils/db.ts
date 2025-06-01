import { randomChars } from "./random";

const MAX_USERNAME_LENGTH = 20;

export function usernameFromName(name: string): string {
  name = name.slice(0, MAX_USERNAME_LENGTH - 7);
  name = name + "-" + randomChars(6);
  return name.replace(" ", "").toLowerCase();
}
