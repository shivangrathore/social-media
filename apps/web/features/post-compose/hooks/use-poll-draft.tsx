"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createDraftPoll, getPollDraft, getPollMeta } from "../api/polls";
import { Post } from "@repo/types";
import { useMemo } from "react";

export function usePollDraft() {
  const {
    data: draft,
    isLoading,
    error,
    refetch,
  } = useQuery<Post>({
    queryKey: ["pollDraft"],
    queryFn: getPollDraft,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: meta } = useQuery({
    queryKey: ["pollDraftOptions", draft?.id],
    queryFn: async () => {
      if (!draft?.id) throw new Error("Draft ID is not available");
      return getPollMeta(draft.id);
    },
    enabled: !!draft?.id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["createPollDraft"],
    mutationFn: createDraftPoll,
    onSuccess: () => {
      // TODO: Remove content blink on draft creation
      refetch();
    },
  });

  const mergedDraft = useMemo(() => {
    if (!draft) return undefined;
    return {
      ...draft,
      options: meta?.options || [],
      expiresAt: meta?.expiresAt || null,
    };
  }, [draft, meta?.options, meta?.expiresAt]);

  return {
    draft: mergedDraft,
    create: mutateAsync,
    isLoading,
    error,
  };
}
