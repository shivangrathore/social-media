"use client";

import { Attachment } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getAttachments } from "../api/upload";
import { useState } from "react";

export function useAttachments(postId: number | undefined) {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery<Attachment[]>({
    queryKey: ["attachments", postId],
    queryFn: async () => {
      if (!postId) return [];
      return await getAttachments(postId);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [attachments, setAttachments] = useState<Attachment[]>(data);

  return {
    draftAttachments: attachments,
    isLoading,
    refetchAttachments: refetch,

    resetAttachments: () => setAttachments([]),
  };
}
