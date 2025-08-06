"use client";
import { UserSuggestionEntry } from "@/components/suggestion-panel";
import { apiClient } from "@/lib/apiClient";
import { User } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

export function WhoToFollow() {
  const { data: suggestions = [], isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const res = await apiClient.get<User[]>("/users/suggestions");
      return res.data;
    },
  });

  return (
    <div className="p-4 mt-4 rounded-md w-full">
      <h3 className="text-lg font-semibold">Who to follow</h3>
      <ul className="mt-4 space-y-2">
        {suggestions.map((user) => (
          <UserSuggestionEntry key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}
