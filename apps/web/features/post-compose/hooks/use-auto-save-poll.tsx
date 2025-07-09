"use client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { saveOptions } from "../api/polls";

type OptionValue = { value: string };

export function useAutoSaveDraftPoll(
  isDirty: boolean,
  postId: number | undefined,
  optionsValues: OptionValue[],
) {
  const { mutateAsync, isPending: isSaving } = useMutation({
    mutationKey: ["saveDraftPollOptions"],
    mutationFn: saveOptions,
  });
  const save = useCallback(
    async ({
      postId,
      optionsValues,
    }: {
      postId: number;
      optionsValues: OptionValue[];
    }) => {
      if (!postId) return;
      await mutateAsync({
        postId,
        options: optionsValues
          .map((o) => o.value)
          .filter((v) => v.trim() !== ""),
      });
    },
    [mutateAsync],
  );

  useEffect(() => {
    if (!isDirty || !postId) return;
    const timeout = setTimeout(() => {
      save({ postId, optionsValues });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isDirty, optionsValues]);

  return { isSaving, save };
}
