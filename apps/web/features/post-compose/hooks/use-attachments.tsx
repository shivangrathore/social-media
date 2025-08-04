"use client";

import { Attachment } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getAttachments } from "../api/upload";
import { useEffect, useRef, useState } from "react";

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

  const [attachments, setAttachments] = useState<Attachment[]>(data);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      setAttachments(data);
    }
  }, [data]);

  return {
    draftAttachments: attachments,
    isLoading,
    refetchAttachments: refetch,

    resetAttachments: () => setAttachments([]),
  };
}
