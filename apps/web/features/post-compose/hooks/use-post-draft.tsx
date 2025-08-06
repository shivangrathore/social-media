"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createDraftPost, getDraftPost } from "../api/posts";
import { useEffect, useState } from "react";
import { Attachment, Post } from "@repo/types";
import { AxiosError } from "axios";

type PostWithAttachments = {
  attachments: Attachment[];
} & Post;

export function usePostDraft() {
  const [draft, setDraft] = useState<PostWithAttachments | null>(null);
  const { data, isLoading, error, refetch } = useQuery({
    initialData: null,
    queryKey: ["postDraft"],
    queryFn: getDraftPost,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutateAsync: create } = useMutation({
    mutationKey: ["createDraftPost"],
    mutationFn: createDraftPost,
    onSuccess: (data) => {
      setDraft(data);
    },
  });

  useEffect(() => {
    if (data) {
      setDraft(data);
    }
  }, [data]);

  return {
    draft,
    isLoading,
    error,
    refetch,
    create,
  };
}
