"use client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { saveDraftPoll } from "../api/polls";

export function useAutoSaveDraft(
  isDirty: boolean,
  postId: number | undefined,
  question: string,
  optionsValues: { value: string }[],
) {
  const { mutateAsync, isPending: isSaving } = useMutation({
    mutationKey: ["saveDraftPoll"],
    mutationFn: saveDraftPoll,
  });

  useEffect(() => {
    if (!isDirty || !postId) return;
    const timeout = setTimeout(() => {
      mutateAsync({
        postId,
        question,
        options: optionsValues
          .map((o) => o.value)
          .filter((v) => v.trim() !== ""),
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isDirty, question, optionsValues]);

  return { isSaving };
}
