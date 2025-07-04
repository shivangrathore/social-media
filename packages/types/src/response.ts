import { User } from "./types";

export type LoginResponse = {
  message: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
};

export type GetSignatureResponse = {
  signature: string;
  apiKey: string;
  folder: string;
  timestamp: string;
  context: string;
  uploadUrl: string;
};
