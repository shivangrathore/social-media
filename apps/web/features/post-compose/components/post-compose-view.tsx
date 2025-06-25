"use client";
import React, { useEffect, useId } from "react";
import { useAutosavePost } from "../hooks/use-auto-save-post";
import AutoHeightTextarea from "@/components/auto-height-textarea";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { usePostDraft } from "../hooks/use-post-draft";
import { cn } from "@/lib/utils";
import { ComposePostLoadingSkeleton } from "./post-loading-skeleton";
import { ImageIcon } from "lucide-react";
import EmojiPicker from "./emoji-picker";
import { useUploadFiles } from "../hooks/use-upload-files";
import { attachAttachmentToPost } from "../api/upload";
import { AttachmentFile } from "@repo/api-types";
import { CircularProgress } from "@/components/circular-progress";

const AttachmentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  userId: z.number(),
  url: z.string().url("Invalid URL"),
  assetId: z.string(),
  publicId: z.string(),
  type: z.enum(["image", "video"]),
});

const PostComposeSchema = z.object({
  content: z.string().min(1, "Content is required"),
  attachments: z.array(AttachmentSchema).default([]),
});

const toolbarButtonClassNames =
  "rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors mr-2";

export function PostComposeView() {
  const { draft, isLoading: isDraftLoading } = usePostDraft();
  const form = useForm({ resolver: zodResolver(PostComposeSchema) });
  const content = useWatch({ control: form.control, name: "content" });
  // TODO: Remove any
  const onAttachmentUploaded = async (a: any): Promise<number | undefined> => {
    if (!draft) return;
    const attach = await attachAttachmentToPost(draft.id, a);
    return attach.id;
  };
  const { files: uploadingFiles, addFiles } = useUploadFiles({
    onAttachmentUploaded,
  });
  const isDirty = form.formState.isDirty;
  const inputId = useId();
  const onEmojiSelect = (emoji: string) => {
    const currentContent = form.getValues("content");
    form.setValue("content", currentContent + emoji);
  };
  useAutosavePost(isDirty, draft?.id, content, []);
  useEffect(() => {
    if (draft) {
      form.reset({
        content: draft.content || "",
        attachments: draft.attachments || [],
      });
    }
  }, [draft]);
  if (isDraftLoading) return <ComposePostLoadingSkeleton />;
  const attachments = form.watch("attachments", []) as AttachmentFile[];
  return (
    <Form {...form}>
      <form>
        <AutoHeightTextarea
          {...form.register("content")}
          className={cn(
            "p-4 rounded-lg border border-border w-full resize-none overflow-hidden text-base",
          )}
          placeholder="What's on your mind?"
          rows={1}
        />
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          id={inputId}
          onChange={(e) => {
            if (!draft) return;
            if (e.target.files) {
              const filesArray = Array.from(e.target.files);
              addFiles(draft.id, ...filesArray);
              e.target.value = "";
            }
          }}
        />
        {(attachments.length > 0 || uploadingFiles.length > 0) && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative overflow-hidden rounded-lg"
              >
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt=""
                    className="object-cover h-full"
                  />
                ) : (
                  <video
                    src={attachment.url}
                    controls
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ))}
            {uploadingFiles.map((file) => (
              <div key={file.id} className="relative">
                {file.file.type.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.file.name}
                    className="w-full h-auto rounded-lg mb-2"
                  />
                ) : (
                  <video
                    src={file.url}
                    controls
                    className="w-full h-auto rounded-lg mb-2"
                  />
                )}
                {!file.uploaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CircularProgress
                      size={80}
                      progress={file.progress}
                      strokeWidth={4}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex mt-1">
          <label htmlFor={inputId} className={toolbarButtonClassNames}>
            <ImageIcon className="size-5" />
          </label>
          <EmojiPicker
            emojiSelect={onEmojiSelect}
            className={toolbarButtonClassNames}
          />
        </div>
      </form>
    </Form>
  );
}
