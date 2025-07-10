import { User } from "@repo/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

export function UserProfileSkeleton() {
  return (
    <div className="flex gap-2 items-center">
      <Skeleton className="rounded-full size-10" />
      <div>
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function UserProfile({
  user: { username, avatar, name },
}: {
  user: User;
}) {
  return (
    <Link className="flex gap-2 items-center" href={`/u/${username}`}>
      <Avatar className="rounded-full size-10">
        <AvatarImage src={avatar || undefined} />
        <AvatarFallback>{getInitials(name || "")}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-sm font-medium">{name}</h2>
        <p className="text-xs text-gray-500">@{username}</p>
      </div>
    </Link>
  );
}
