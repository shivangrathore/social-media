import { useQuery } from "@tanstack/react-query";
import { getChat } from "../api";

export function useChat(id: number | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChat(id!),
    enabled: !!id,
  });
  return {
    chat: data || null,
    isLoading,
  };
}
