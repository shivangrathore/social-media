import { IAuthRepository } from "./respository";

export class AuthRepository implements IAuthRepository {
  async login(username: string, password: string): Promise<string> {
    // Simulate a login operation
    if (username === "user" && password === "pass") {
      return "Login successful";
    } else {
      throw new Error("Invalid credentials");
    }
  }
}
