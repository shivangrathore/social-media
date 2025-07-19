import { apiClient } from "@/lib/apiClient";
import { Chat } from "@repo/types";

export async function getChats() {
  const res = await apiClient.get<Chat[]>("/chats");
  return res.data;
}

export async function getChat(chatId: number) {
  const res = await apiClient.get<Chat>(`/chats/${chatId}`);
  return res.data;
}

export async function getChatByUserId(userId: number) {
  const res = await apiClient.get<Chat>(`/chats/user/${userId}`);
  return res.data;
}

export async function createChat(userId: number) {
  const res = await apiClient.post<Chat>("/chats", { userId });
  return res.data;
}
