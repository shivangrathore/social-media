"use client";
import { useStore } from "zustand";
import { ComposePostLoadingSkeleton } from "./post-loading-skeleton";
import { postStore } from "../store/postStore";
import { ChangeEvent, useCallback, useState } from "react";
import AutoHeightTextarea from "./auto-height-textarea";
import PostToolbar from "./post-toolbar";
import { useAutosave } from "../hooks/use-auto-save";
import { PollComposeView } from "./poll-compose-view";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { BarChart3, FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostComposeMode } from "../types";

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
  const [mode, setMode] = useState<PostComposeMode>("post");
  useAutosave(content || "", 1000);
  if (isPostLoading) {
    return <ComposePostLoadingSkeleton />;
  }
  return (
    <div className="my-6 p-4 bg-white rounded-md border-border border">
      <div className="flex gap-4">
        <Avatar className="size-10">
          <AvatarImage />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <div className="flex border-b border-border flex-grow">
          <button
            className={cn(
              "flex items-center gap-2 py-2 px-3 text-sm cursor-pointer font-medium",
              {
                "text-primary border-b-2 border-primary": mode === "post",
                "hover:text-foreground text-muted-foreground": mode !== "post",
              },
            )}
            onClick={() => setMode("post")}
          >
            <FileTextIcon className="size-4" />
            Post
          </button>
          <button
            className={cn(
              "flex items-center gap-2 py-2 px-3 text-sm cursor-pointer font-medium",
              {
                "text-primary border-b-2 border-primary": mode === "poll",
                "hover:text-foreground text-muted-foreground": mode !== "poll",
              },
            )}
            onClick={() => setMode("poll")}
          >
            <BarChart3 className="size-4" />
            Poll
          </button>
        </div>
      </div>
      <div className="mt-4">
        {mode == "poll" ? (
          <PollComposeView />
        ) : (
          <AutoHeightTextarea
            value={content || ""}
            onChange={textAreaChange}
            className="p-4 rounded-lg border border-border w-full resize-none overflow-hidden text-base"
            placeholder="What's on your mind?"
            rows={1}
          />
        )}
        <PostToolbar mode={mode} />
      </div>
    </div>
  );
}
