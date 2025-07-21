import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../api";
import { GetFeedResponse } from "@repo/types";

export function useUserPosts(id: number) {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery<
    GetFeedResponse,
    Error,
    InfiniteData<GetFeedResponse>,
    string[],
    number | null
  >({
    queryKey: [`user:posts:${id}`],
    queryFn: ({ pageParam }) => getUserPosts(id, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  });

  return {
    posts: data?.pages.flatMap((page) => page.data) || [],
    isLoading,
    fetchNextPage,
  };
}
