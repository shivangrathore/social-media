"use client";
import AutoHeightTextarea from "@/components/auto-height-textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export function PostCommentForm({
  postId,
  onCommentAdd,
}: {
  postId: number;
  onCommentAdd(content: string): Promise<void>;
}) {
  const form = useForm({ resolver: zodResolver(CreateCommentSchema) });
  const onSubmit = useCallback(
    async (data: { content: string }) => {
      onCommentAdd(data.content);
    },
    [onCommentAdd],
  );
  return (
    <form
      className="flex flex-col w-full mt-1"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <AutoHeightTextarea
        className="w-full resize-none overflow-hidden"
        content=""
        rows={1}
        {...form.register("content")}
      />
      <Button className="ml-auto mt-4" size="sm">
        Post
      </Button>
    </form>
  );
}
