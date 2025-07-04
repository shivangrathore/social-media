import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { saveDraftPost } from "../api/posts";
import { Post } from "@repo/types";

export function useAutosavePost(
  isDirty: boolean,
  postId: number | undefined,
  content: string,
  create: (content: string | undefined) => Promise<Post>,
) {
  const { mutateAsync, isPending: isSaving } = useMutation({
    mutationKey: ["saveDraftPost"],
    mutationFn: saveDraftPost,
  });

  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(async () => {
      if (!postId) {
        const post = await create(content);
        postId = post.id;
      }
      await mutateAsync({
        id: postId,
        content: content.trim(),
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isDirty, content, postId, mutateAsync]);

  return { isSaving };
}
