"use client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { saveOptions } from "../api/polls";

export function useAutoSaveDraftPoll(
  isDirty: boolean,
  postId: number | undefined,
  optionsValues: { value: string }[],
) {
  const { mutateAsync, isPending: isSaving } = useMutation({
    mutationKey: ["saveDraftPollOptions"],
    mutationFn: saveOptions,
  });

  useEffect(() => {
    if (!isDirty || !postId) return;
    const timeout = setTimeout(() => {
      mutateAsync({
        postId,
        options: optionsValues
          .map((o) => o.value)
          .filter((v) => v.trim() !== ""),
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isDirty, optionsValues]);

  return { isSaving };
}
