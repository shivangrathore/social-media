export function randomChars(limit: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < limit; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
