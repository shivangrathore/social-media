import { useQuery } from "@tanstack/react-query";
import { getUserComments } from "../api";

export function useUserComments(id: number) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["userComments", id],
    queryFn: () => getUserComments(id),
  });

  return {
    comments: data,
    isLoading,
  };
}
