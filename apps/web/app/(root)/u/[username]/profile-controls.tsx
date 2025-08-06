"use client";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/users/follow-button";
import { useUser } from "@/store/auth";
import { User } from "@repo/types";

export function ProfileControls({ profile }: { profile: User }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div />;
  }

  return (
    <div className="flex items-center gap-2">
      {user!.id == profile.id ? (
        <Button className="rounded-full" variant="outline">
          Edit
        </Button>
      ) : (
        <FollowButton
          username={profile.username}
          isFollowing={profile.isFollowing || false}
        />
      )}
    </div>
  );
}
