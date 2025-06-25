import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { saveDraftPost } from "../api/posts";

export function useAutosavePost(
  isDirty: boolean,
  postId: number | undefined,
  content: string,
  attachments: { id: number; url: string; type: "image" | "video" }[],
) {
  const { mutateAsync, isPending: isSaving } = useMutation({
    mutationKey: ["saveDraftPost"],
    mutationFn: saveDraftPost,
  });

  useEffect(() => {
    if (!isDirty || !postId) return;
    const timeout = setTimeout(() => {
      mutateAsync({
        id: postId,
        content: content.trim(),
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isDirty, content, attachments, postId, mutateAsync]);

  return { isSaving };
}
