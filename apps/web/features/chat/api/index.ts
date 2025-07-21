import { apiClient } from "@/lib/apiClient";
import { Chat, ChatMessage, GetChatsResponse } from "@repo/types";

export async function getChats(cursor: number | null = null) {
  const res = await apiClient.get<GetChatsResponse>("/chats", {
    params: {
      cursor: cursor || undefined,
    },
  });
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

export async function createMessage(chatId: number, content: string) {
  const res = await apiClient.post<ChatMessage>(`/chats/${chatId}/messages`, {
    content,
  });
  return res.data;
}

export async function getMessages(chatId: number) {
  const res = await apiClient.get<ChatMessage[]>(`/chats/${chatId}/messages`);
  return res.data;
}
