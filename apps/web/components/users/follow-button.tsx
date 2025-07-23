import { useEffect } from "react";
import { Button } from "../ui/button";
import { useFollowStore } from "@/store/follow-store";
import { followUser, unfollowUser } from "@/lib/api";

export default function FollowButton({
  username,
  isFollowing,
}: {
  username: string;
  isFollowing: boolean;
}) {
  const isFollowingState = useFollowStore((state) => state.following[username]);
  const setFollowing = useFollowStore((state) => state.setFollowing);
  console.log("isFollowingState", isFollowingState);
  useEffect(() => {
    if (isFollowingState === undefined) {
      setFollowing(username, isFollowing);
    }
  }, [username, isFollowing, isFollowingState]);
  const handleUnfollow = async () => {
    setFollowing(username, false);
    try {
      await unfollowUser(username);
    } catch {
      setFollowing(username, true);
    }
  };
  const handleFollow = async () => {
    setFollowing(username, true);
    try {
      await followUser(username);
    } catch {
      setFollowing(username, false);
    }
  };
  return isFollowingState ? (
    <Button variant="outline" className="rounded-full" onClick={handleUnfollow}>
      Unfollow
    </Button>
  ) : (
    <Button className="rounded-full bg-primary" onClick={handleFollow}>
      Follow
    </Button>
  );
}
