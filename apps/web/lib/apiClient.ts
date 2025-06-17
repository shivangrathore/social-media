import axios from "axios";

const url = new URL("/api/v1", process.env.NEXT_PUBLIC_APP_URL);

export const apiClient = axios.create({
  baseURL: url.toString(),
  adapter: "fetch",
});
