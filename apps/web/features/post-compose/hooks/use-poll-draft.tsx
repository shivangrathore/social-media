"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createDraftPoll } from "../api/polls";
import { CreatePollDraftResponse } from "@repo/api-types/poll";

export function usePollDraft() {
  const {
    data: draft,
    isLoading,
    error,
    refetch,
  } = useQuery<CreatePollDraftResponse>({
    queryKey: ["pollDraft"],
    queryFn: createDraftPoll,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["createPollDraft"],
    mutationFn: createDraftPoll,
    onSuccess: () => {
      refetch();
    },
  });

  return {
    draft,
    create: mutateAsync,
    isLoading,
    error,
  };
}
