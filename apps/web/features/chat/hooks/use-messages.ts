"use client";
import { useMessagesStore } from "@/store/messages-store";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../api";
import { ChatMessage } from "@repo/types";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function useMessages(chatId: number) {
  const messages = useMessagesStore(
    useShallow((state) => state.messages[chatId] || []),
  );
  const addMessage = useMessagesStore((state) => state.addMessage);
  const clearMessages = useMessagesStore((state) => state.clearMessages);
  const hydrateMessages = useMessagesStore((state) => state.hydrateMessages);

  const { data } = useQuery<ChatMessage[]>({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
  });

  useEffect(() => {
    if (data) {
      hydrateMessages(chatId, data);
    }
  }, [data, chatId, hydrateMessages]);

  return {
    messages,
    addMessage,
    clearMessages,
  };
}
