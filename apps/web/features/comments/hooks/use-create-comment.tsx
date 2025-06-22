"use client";
import { useMutation } from "@tanstack/react-query";
import { createComment } from "../api/create-comment";

export function useCreateComment({ postId }: { postId: number }) {
  const { mutateAsync } = useMutation({
    mutationFn: async (content: string) =>
      await createComment({ postId, content }),
    mutationKey: ["comment"],
  });
  return { create: mutateAsync };
}
