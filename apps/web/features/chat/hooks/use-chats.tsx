"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getChats } from "../api";
import { Chat, GetChatsResponse } from "@repo/types";
import { useChatStore } from "@/store/chat-store";
import { useEffect } from "react";
import socket from "@/lib/socket";

export function useChats() {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery<
    GetChatsResponse,
    Error,
    InfiniteData<GetChatsResponse>,
    string[],
    number | null
  >({
    queryKey: ["chats"],
    queryFn: ({ pageParam }) => getChats(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const chats = useChatStore((state) => state.chats);
  const hydrateChats = useChatStore((state) => state.hydrateChats);

  useEffect(() => {
    hydrateChats(data?.pages.flatMap((page) => page.data) || []);
  }, [data]);

  useEffect(() => {
    function handleChatCreate(chat: Chat) {
      hydrateChats([chat]);
    }

    socket.on("chat:new", handleChatCreate);

    return () => {
      socket.off("chat:new", handleChatCreate);
    };
  }, [hydrateChats]);

  return {
    chats,
    isLoading,
    fetchNextPage,
  };
}
