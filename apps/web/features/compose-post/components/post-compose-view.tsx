import { useStore } from "zustand";
import { postStore } from "../store/postStore";
import React, { useCallback } from "react";
import { useAutosave } from "../hooks/use-auto-save";
import { ComposePostLoadingSkeleton } from "./post-loading-skeleton";
import AutoHeightTextarea from "@/components/auto-height-textarea";
import { FileUploadGrid } from "./file-upload-grid";
import PostToolbar from "./post-toolbar";

export function PostComposeView() {
  const content = useStore(postStore, (state) => state.post.content);
  const isPostLoading = useStore(postStore, (state) => state.isLoading);
  const setContent = useStore(postStore, (state) => state.setContent);
  const textAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent],
  );
  useAutosave(content || "", 1000);
  if (isPostLoading) {
    return <ComposePostLoadingSkeleton />;
  }
  return (
    <>
      <AutoHeightTextarea
        value={content || ""}
        onChange={textAreaChange}
        className="p-4 rounded-lg border border-border w-full resize-none overflow-hidden text-base"
        placeholder="What's on your mind?"
        rows={1}
      />
      <FileUploadGrid />
      <PostToolbar mode="post" />
    </>
  );
}
