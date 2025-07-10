import { SuggestionPanel } from "@/components/suggestion-panel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";
import { getInitials } from "@/lib/utils";
import { User } from "@repo/types";
import { notFound } from "next/navigation";
import { ProfileControls } from "./profile-controls";

async function getUserByUsername(username: string): Promise<User> {
  try {
    const res = await apiClient.get<User>(`/users/username/${username}`);
    return res.data;
  } catch (e) {
    notFound();
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  return (
    <div className="flex gap-36">
      <div className="ml-20 max-w-lg shrink-0 w-3xl">
        <div className="w-full h-40 bg-muted">
          {/*  TODO: Add cover image */}
        </div>
        <Avatar className="size-32 -mt-24 ml-4 border-4 border-background">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback className="text-3xl">
            {getInitials(user.name || "User")}
          </AvatarFallback>
        </Avatar>
        <div className="flex justify-between gap-4 mt-4">
          <div>
            <h2 className="text-2xl font-medium">{user.name}</h2>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          </div>
          <ProfileControls profile={user} />
        </div>
        {user.bio && <p className="mt-4">{user.bio}</p>}
      </div>
      <SuggestionPanel />
    </div>
  );
}
