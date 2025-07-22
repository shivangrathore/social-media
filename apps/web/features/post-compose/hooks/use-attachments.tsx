"use client";

import { Attachment } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getAttachments } from "../api/upload";

export function useAttachments(postId: number | undefined) {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery<Attachment[]>({
    queryKey: ["attachments", postId],
    queryFn: async () => getAttachments(postId as number),
    enabled: !!postId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return {
    draftAttachments: data,
    isLoading,
    refetchAttachments: refetch,
  };
}
