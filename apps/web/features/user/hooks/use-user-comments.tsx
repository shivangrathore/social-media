import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getUserComments } from "../api";
import { GetUserCommentsResponse } from "@repo/types";

export function useUserComments(id: number) {
  const { data, isLoading } = useInfiniteQuery<
    GetUserCommentsResponse,
    Error,
    InfiniteData<GetUserCommentsResponse>,
    any[],
    number | null
  >({
    initialPageParam: null,
    queryKey: ["userComments", id],
    queryFn: ({ pageParam }) => getUserComments(id, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  console.log("useUserComments", data, isLoading);

  return {
    comments: data?.pages.flatMap((page) => page.data) || [],
    isLoading,
  };
}
