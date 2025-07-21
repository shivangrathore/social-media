import { apiClient } from "@/lib/apiClient";
import {
  Chat,
  ChatMessage,
  GetChatMessagesResponse,
  GetChatsResponse,
} from "@repo/types";

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

export async function getMessages(
  chatId: number,
  cursor: number | null = null,
) {
  const res = await apiClient.get<GetChatMessagesResponse>(
    `/chats/${chatId}/messages`,
    {
      params: {
        cursor: cursor || undefined,
        limit: 10,
      },
    },
  );
  return res.data;
}
