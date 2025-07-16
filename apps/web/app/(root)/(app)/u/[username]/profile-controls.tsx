"use client";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/lib/api";
import { useUser } from "@/store/auth";
import { User } from "@repo/types";
import { useState } from "react";

export function ProfileControls({ profile }: { profile: User }) {
  const { user, isLoading } = useUser();
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);

  if (isLoading) {
    return <div />;
  }

  async function handleFollow() {
    setIsFollowing(true);
    try {
      await followUser(profile.username);
    } catch (error) {
      setIsFollowing(false);
    }
  }

  async function handleUnfollow() {
    if (!user) return;
    setIsFollowing(false);
    try {
      await unfollowUser(profile.username);
    } catch (error) {
      setIsFollowing(true);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {user!.id == profile.id ? (
        <Button className="rounded-full" variant="outline">
          Edit
        </Button>
      ) : (
        <>
          {isFollowing ? (
            <Button
              className="rounded-full"
              variant="outline"
              onClick={handleUnfollow}
            >
              Unfollow
            </Button>
          ) : (
            <Button className="rounded-full" onClick={handleFollow}>
              Follow
            </Button>
          )}
          <Button className="rounded-full" variant="outline">
            Message
          </Button>
        </>
      )}
    </div>
  );
}
