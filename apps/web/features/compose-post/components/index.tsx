"use client";
import { useStore } from "zustand";
import { PostLoadingSkeleton } from "./post-loading-skeleton";
import { postStore } from "../store/postStore";
import { ChangeEvent, useCallback } from "react";
import AutoHeightTextarea from "./auto-height-textarea";
import { FileUploadGrid } from "./file-upload-grid";
import PostToolbar from "./post-toolbar";
import { useAutosave } from "../hooks/use-auto-save";

export function ComposePost() {
  const content = useStore(postStore, (state) => state.post.content);
  const isPostLoading = useStore(postStore, (state) => state.isLoading);
  const setContent = useStore(postStore, (state) => state.setContent);
  const textAreaChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [setContent],
  );
  useAutosave(content || "", 1000);
  if (isPostLoading) {
    return <PostLoadingSkeleton />;
  }
  return (
    <div className="my-6 p-4 bg-white">
      <div className="relative">
        <AutoHeightTextarea
          value={content || ""}
          onChange={textAreaChange}
          className="p-4 rounded-lg border border-border w-full resize-none overflow-hidden text-base"
          placeholder="What's on your mind?"
          rows={1}
        />
        <FileUploadGrid />
        <PostToolbar />
      </div>
    </div>
  );
}
