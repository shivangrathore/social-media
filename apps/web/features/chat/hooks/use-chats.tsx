"use client";

import { useQuery } from "@tanstack/react-query";
import { getChats } from "../api";

export function useChats() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });
  return {
    chats: data,
    isLoading,
  };
}
