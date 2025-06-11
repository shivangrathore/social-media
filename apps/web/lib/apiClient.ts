import axios from "axios";

const url = new URL("/api/v1", process.env.NEXT_PUBLIC_API_URL);

export const apiClient = axios.create({
  baseURL: url.toString(),
  adapter: "fetch",
});
