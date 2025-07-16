import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../api";

export function useUserPosts(id: number) {
  const { data, isLoading } = useQuery({
    queryKey: [`user:posts:${id}`],
    queryFn: () => getUserPosts(id),
  });

  return {
    posts: data ? data.data : [],
    isLoading,
  };
}
