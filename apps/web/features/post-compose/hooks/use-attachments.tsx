"use client";

import { Attachment } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { attachAttachmentToPost, getAttachments } from "../api/upload";

export function useAttachments(postId: number | undefined) {
  const {
    data: draftAttachments,
    isLoading,
    refetch,
  } = useQuery<Attachment[]>({
    queryKey: ["attachments", postId],
    queryFn: async () => getAttachments(postId as number),
    enabled: !!postId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { mutateAsync: addAttachment } = useMutation({
    mutationKey: ["addAttachment", postId],
    mutationFn: async (data: any) => {
      if (!postId) {
        throw new Error("Post ID is required to attach an attachment");
      }
      return attachAttachmentToPost(postId, data);
    },
  });
  return {
    draftAttachments,
    isLoading,
    addAttachment,
    refetchAttachments: refetch,
  };
}
