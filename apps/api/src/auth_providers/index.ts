import config from "../config";
import { Provider } from "./base";
import { GoogleProvider } from "./google";

export const providers = {
  google: new GoogleProvider(
    "google",
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
  ),
} as Record<string, Provider>;
