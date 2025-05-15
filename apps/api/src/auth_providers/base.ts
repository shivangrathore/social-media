export abstract class Provider {
  id: string;
  clientId: string;
  clientSecret: string;
  constructor(id: string, clientId: string, clientSecret: string) {
    this.id = id;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
  get redirectUri(): string {
    // TODO: make this configurable
    return `http://localhost:3000/api/v1/auth/provider/${this.id}/callback`;
  }
  abstract oAuthUrl(state?: Record<string, any>): string;
  abstract exchangeCodeForTokenUrl(): string;
  abstract fetchUserUrl(token: string): string;
  abstract fetchUser(token: string): Promise<ProviderUser>;
  abstract fetchToken(code: string): Promise<string>;
}

export class ProviderUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  constructor(id: string, name: string, email: string, picture: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.picture = picture;
  }
}
