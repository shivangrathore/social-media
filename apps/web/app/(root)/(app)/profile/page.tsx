import { fetchCurrentUser } from "@/lib/utils.server";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await fetchCurrentUser();
  redirect(`/u/${user?.username}`);
}
