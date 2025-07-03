import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

type UserProfileProps = {
  avatarUrl?: string;
  username: string;
};

export function UserProfile({ avatarUrl, username }: UserProfileProps) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar className="rounded-full size-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{getInitials(username)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-sm font-medium">{username}</h2>
        <p className="text-xs text-gray-500">@{username}</p>
      </div>
    </div>
  );
}
