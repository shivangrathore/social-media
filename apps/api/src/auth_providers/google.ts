import { Provider, ProviderUser } from "./base";
import axios from "axios";

export class GoogleProvider extends Provider {
  oAuthUrl(state?: Record<string, any>): string {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("redirect_uri", this.redirectUri);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "openid email profile");
    url.searchParams.append("state", JSON.stringify(state));
    return url.toString();
  }

  fetchUserUrl(token: string): string {
    const url = new URL("https://www.googleapis.com/oauth2/v3/userinfo");
    url.searchParams.append("access_token", token);
    return url.toString();
  }

  exchangeCodeForTokenUrl(): string {
    const url = new URL("https://oauth2.googleapis.com/token");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("client_secret", this.clientSecret);
    url.searchParams.append("redirect_uri", this.redirectUri);
    url.searchParams.append("grant_type", "authorization_code");
    return url.toString();
  }

  async fetchUser(token: string): Promise<ProviderUser> {
    const url = this.fetchUserUrl(token);
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error("Failed to fetch user");
    }
    const data = response.data;
    return new ProviderUser(data.sub, data.name, data.email, data.picture);
  }

  async fetchToken(code: string): Promise<string> {
    const url = this.exchangeCodeForTokenUrl();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    return data.access_token;
  }
}
