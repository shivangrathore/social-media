"use client";
import React, { useEffect, useId } from "react";
import { useAutosavePost } from "../hooks/use-auto-save-post";
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
import { deleteAttachment } from "../api/upload";
import { AttachmentGrid } from "./attachment-grid";
import { Button } from "@/components/ui/button";
import { publishPost } from "../api/posts";
import { RichTextArea } from "@/components/rich-text-area";

const AttachmentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  assetId: z.string(),
  type: z.string().min(1),
});

const PostComposeSchema = z.object({
  content: z.string().min(1, "Content is required"),
  attachments: z.array(AttachmentSchema).default([]),
});

type PostComposeSchema = z.infer<typeof PostComposeSchema>;

const toolbarButtonClassNames =
  "rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors mr-2";

export function PostComposeView() {
  const {
    draft,
    isLoading: isDraftLoading,
    refetch: refetchDraft,
    create,
  } = usePostDraft();
  const form = useForm({
    resolver: zodResolver(PostComposeSchema),
    defaultValues: { content: "" },
  });
  const content = useWatch({ control: form.control, name: "content" });
  const {
    files: uploadingFiles,
    addFiles,
    isUploading,
    reset: resetFiles,
    remove: removeUploadingFile,
  } = useUploadFiles();
  async function handleFileSelect(files: FileList | null) {
    if (!files) return;
    let post = draft;
    if (!post) {
      post = await create(content);
    }
    const filesArray = Array.from(files);
    addFiles(post.id, ...filesArray);
  }
  const isDirty = Boolean(
    form.formState.isDirty ||
      uploadingFiles.length > 0 ||
      draft?.attachments?.length,
  );
  const isValid = form.formState.isValid;
  const { forceSave } = useAutosavePost(isDirty, draft?.id, content, create);
  console.log("Draft:", draft);
  const onSubmit = async (data: PostComposeSchema) => {
    if (!draft) return;
    await forceSave({ id: draft.id, content: data.content });
    await publishPost(draft.id);
    refetchDraft();
    resetFiles();
    form.reset();
  };
  const inputId = useId();
  const onEmojiSelect = (emoji: string) => {
    const currentContent = form.getValues("content");
    let newContent = currentContent;
    if (currentContent.trim() != "" && !currentContent.endsWith(" ")) {
      newContent += " ";
    }
    newContent += emoji + " ";
    form.setValue("content", newContent, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  useEffect(() => {
    if (draft) {
      form.setValue("content", draft.content || "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [draft]);
  const handleDeleteAttachment = async (attachmentId: number) => {
    await deleteAttachment(attachmentId);
    const currentAttachments = form.getValues("attachments") || [];
    const updatedAttachments = currentAttachments.filter(
      (att) => att.id !== attachmentId,
    );
    form.setValue("attachments", updatedAttachments, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  if (isDraftLoading) return <ComposePostLoadingSkeleton />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <RichTextArea
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
          multiple
          id={inputId}
          onChange={(e) => {
            handleFileSelect(e.target.files);
          }}
        />
        <AttachmentGrid
          attachments={draft?.attachments || []}
          uploadingFiles={uploadingFiles}
          removeUploadingFile={removeUploadingFile}
          removeAttachment={handleDeleteAttachment}
        />
        <div className="flex mt-2 items-center">
          <label htmlFor={inputId} className={toolbarButtonClassNames}>
            <ImageIcon className="size-5" />
          </label>
          <EmojiPicker
            emojiSelect={onEmojiSelect}
            className={toolbarButtonClassNames}
          />
          <Button
            disabled={!isValid || isUploading || form.formState.isSubmitting}
            className="ml-auto"
            size="sm"
            type="submit"
          >
            Create Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
