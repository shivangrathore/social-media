import { SuggestionPanel } from "@/components/suggestion-panel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { apiClient } from "@/lib/apiClient";
import { getInitials } from "@/lib/utils";
import { User } from "@repo/types";
import { notFound } from "next/navigation";
import { ProfileControls } from "./profile-controls";
import { cookies } from "next/headers";
import { ProfileInfo } from "./profile-info";

async function getUserByUsername(username: string): Promise<User> {
  const cookieStore = await cookies();
  try {
    const res = await apiClient.get<User>(`/users/username/${username}`, {
      headers: {
        Authorization: `Bearer ${cookieStore.get("token")?.value || ""}`,
      },
    });
    return res.data;
  } catch (e) {
    console.error("Error fetching user by username:", e);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  return {
    title: `${user.name} (@${user.username}) - Profile`,
    description: `Profile page of ${user.name} (@${user.username}). View their posts, followers, and more.`,
    openGraph: {
      title: `${user.name} (@${user.username}) - Profile`,
      description: `Profile page of ${user.name} (@${user.username}). View their posts, followers, and more.`,
      url: `/users/${user.username}`,
      images: user.avatar ? [user.avatar] : [],
    },
  };
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
        <div className="mt-6" />
        {user.isProfilePublic ? (
          <ProfileInfo id={user.id} />
        ) : (
          <div className="text-muted-foreground">
            <p>This profile is private.</p>
          </div>
        )}
      </div>
      <SuggestionPanel />
    </div>
  );
}
