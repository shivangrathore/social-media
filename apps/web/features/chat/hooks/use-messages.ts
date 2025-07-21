"use client";
import { useMessagesStore } from "@/store/messages-store";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "../api";
import { GetChatMessagesResponse } from "@repo/types";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function useMessages(chatId: number) {
  const messages = useMessagesStore(
    useShallow((state) => state.messages[chatId] || []),
  );
  const addMessage = useMessagesStore((state) => state.addMessage);
  const clearMessages = useMessagesStore((state) => state.clearMessages);
  const hydrateMessages = useMessagesStore((state) => state.hydrateMessages);

  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<
      GetChatMessagesResponse,
      Error,
      InfiniteData<GetChatMessagesResponse>,
      any[],
      number | null
    >({
      queryKey: ["messages", chatId],
      queryFn: ({ pageParam }) => getMessages(chatId, pageParam),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!chatId,
    });

  useEffect(() => {
    if (data) {
      hydrateMessages(
        chatId,
        data.pages.flatMap((page) => page.data),
      );
    }
  }, [data, chatId, hydrateMessages]);

  return {
    messages,
    addMessage,
    clearMessages,
    isLoading: isLoading || isFetchingNextPage,
    fetchNextPage,
  };
}
