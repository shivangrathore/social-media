import { cookies } from "next/headers";
import { apiClient } from "@/lib/apiClient";
import { notFound } from "next/navigation";
import { FeedPost } from "@repo/types";
import { PostDetailedView } from "./post-detailed-view";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const cook = await cookies();
  const { postId } = await params;
  let post: FeedPost;
  try {
    const res = await apiClient.get(`/feed/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${cook.get("token")?.value || ""}`,
      },
    });
    post = res.data;
  } catch {
    notFound();
  }
  return <PostDetailedView post={post} />;
}
