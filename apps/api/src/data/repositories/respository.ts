export interface IAuthRepository {
  login(username: string, password: string): Promise<string>;
  register(username: string, password: string): Promise<string>;
}
