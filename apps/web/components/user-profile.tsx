import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserProfileProps = {
  avatarUrl?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export function UserProfile({
  avatarUrl,
  username,
  firstName,
  lastName,
}: UserProfileProps) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar className="rounded-full size-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {firstName?.at(0)}
          {lastName?.at(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-sm font-medium">
          {firstName} {lastName}
        </h2>
        <p className="text-xs text-gray-500">@{username}</p>
      </div>
    </div>
  );
}
