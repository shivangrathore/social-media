import { GetPostCommentsResponse } from "@repo/types";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../api";

export function useComments(postId: number) {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery<
    GetPostCommentsResponse,
    Error,
    InfiniteData<GetPostCommentsResponse>,
    any[],
    number | null
  >({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getComments(postId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

  console.log("useComments data", data);

  return {
    comments: data?.pages.flatMap((page) => page.data) || [],
    isLoading,
    fetchNextPage,
  };
}
