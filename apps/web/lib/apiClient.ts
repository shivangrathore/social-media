import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  adapter: "fetch",
});
