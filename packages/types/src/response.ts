import { IUser } from "./types";

export type LoginResponse = {
  message: string;
  user: IUser;
};

export type RegisterResponse = {
  message: string;
};
