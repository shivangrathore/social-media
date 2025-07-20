import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../api";

type UserSearchOptions = {
  searchWhenEmpty?: boolean;
  ignoreMe?: boolean;
};
export function useUserSearch(query: string, options: UserSearchOptions = {}) {
  const {
    data = [],
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["userSearch", query],
    queryFn: () => searchUsers(query, options.ignoreMe),
    enabled: options.searchWhenEmpty || query.length > 0,
    retry: false,
  });
  return {
    users: data,
    isSearching: isLoading || isRefetching,
  };
}
