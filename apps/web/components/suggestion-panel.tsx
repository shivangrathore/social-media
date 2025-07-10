"use client";
import { useUser } from "@/store/auth";
import { Input } from "./ui/input";
import { UserProfile, UserProfileSkeleton } from "./user-profile";
import { Button } from "./ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { User } from "@repo/types";
import { useCallback } from "react";
import { Skeleton } from "./ui/skeleton";

export function SuggestionPanel() {
  const { user, isLoading } = useUser();

  const UserSuggestion = useCallback(() => {
    const { data: suggestions, isLoading: isSuggestionsLoading } = useQuery({
      queryKey: ["suggestions"],
      queryFn: async () => {
        const res = await apiClient.get<User[]>("/users/suggestions");
        return res.data;
      },
    });
    if (isSuggestionsLoading) {
      return (
        <div>
          <Skeleton className="h-4 w-32 mt-8" />
          <div className="flex flex-col gap-4 mt-4">
            {new Array(3).fill(0).map((_, index) => (
              <div
                key={index}
                className="flex gap-2 items-center justify-between"
              >
                <UserProfileSkeleton />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!suggestions || suggestions.length === 0) {
      return null;
    }
    return (
      <div>
        <h1 className="text-lg font-medium mt-6">Who to follow</h1>
        <div className="flex flex-col gap-4 mt-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex gap-2 items-center justify-between"
            >
              <UserProfile user={suggestion} />
              <Button variant="secondary">Follow</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }, []);
  return (
    <div className="w-[320px] mt-6 relative shrink-0">
      <div className="sticky top-6">
        <Input type="search" placeholder="Search" className="py-5" />
        <div className="flex flex-col p-4 rounded-md mt-4 bg-background border border-border">
          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              {isLoading ? (
                <UserProfileSkeleton />
              ) : (
                user && <UserProfile user={user} />
              )}
            </div>
            <Link
              prefetch={false}
              href={"/api/v1/auth/logout"}
              className="text-red-500 text-sm"
            >
              Logout
            </Link>
          </div>
          <UserSuggestion />
          <div>
            <h1 className="text-lg font-medium mt-6">What's Trending</h1>
            <div className="flex flex-col gap-4 mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
