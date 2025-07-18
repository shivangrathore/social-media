"use client";
import { useUser } from "@/store/auth";
import { Input } from "./ui/input";
import { UserProfile, UserProfileSkeleton } from "./user-profile";
import { Button } from "./ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { User } from "@repo/types";
import { useCallback, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { followUser, unfollowUser } from "@/lib/api";
import { getTrendingTags } from "@/features/explore/api";

export function UserSuggestionEntry({ user }: { user: User }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const handleUnfollow = async () => {
    setIsFollowing(false);
    await unfollowUser(user.username);
  };
  const handleFollow = async () => {
    setIsFollowing(true);
    await followUser(user.username);
  };
  return (
    <div className="flex gap-2 items-center justify-between">
      <UserProfile user={user} />
      {isFollowing ? (
        <Button
          variant="outline"
          className="rounded-full"
          onClick={handleUnfollow}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          className="rounded-full"
          variant="outline"
          onClick={handleFollow}
        >
          Follow
        </Button>
      )}
    </div>
  );
}

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
            <UserSuggestionEntry key={suggestion.id} user={suggestion} />
          ))}
        </div>
      </div>
    );
  }, []);
  const TrendingHashtags = useCallback(() => {
    const { data: tags, isLoading: isTagsLoading } = useQuery({
      queryKey: ["trending-tags"],
      queryFn: getTrendingTags,
    });

    if (isTagsLoading) {
      return (
        <div>
          <Skeleton className="h-4 w-32 mt-8" />
          <div className="flex flex-col gap-4 mt-4">
            {new Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!tags || tags.length === 0) {
      return null;
    }
    return (
      <div>
        <h1 className="text-lg font-medium mt-4">What's Trending</h1>
        <div className="flex flex-col gap-2 mt-2">
          {tags.map((item, index) => (
            <Link
              href={`/search?query=${encodeURIComponent(`#${item.tag}`)}`}
              key={index}
              className="flex p-2 gap-1 justify-between"
            >
              <h4 className="font-semibold text-sm">#{item.tag}</h4>
              <p className="text-sm text-gray-600">{item.postCount} posts</p>
            </Link>
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
          <div className="flex justify-between">
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
          <TrendingHashtags />
        </div>
      </div>
    </div>
  );
}
