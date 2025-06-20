"use client";
import { useQuery } from "@tanstack/react-query";
import { createDraftPoll } from "../api/polls";
import { CreatePollDraftResponse } from "@repo/api-types/poll";

export function usePollDraft() {
  const {
    data: draft,
    isLoading,
    error,
  } = useQuery<CreatePollDraftResponse>({
    queryKey: ["pollDraft"],
    queryFn: createDraftPoll,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    draft,
    isLoading,
    error,
  };
}
