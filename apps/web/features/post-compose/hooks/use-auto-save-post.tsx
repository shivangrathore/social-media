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
    mutationFn: saveDraftPost,
  });

  function save() {
    if (!postId) {
      return create(content);
    }
    return mutateAsync({ id: postId, content: content.trim() });
  }

  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(async () => {
      await save();
      console.log("Saving post with content", content.trim());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isDirty, content, postId, mutateAsync]);

  return {
    isSaving,
    forceSave: mutateAsync,
  };
}
