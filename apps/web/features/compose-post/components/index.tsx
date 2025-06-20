"use client";
import { PollComposeView } from "./poll-compose-view";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { BarChart3, FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostComposeView } from "./post-compose-view";
import { useComposeMode } from "../hooks/use-compose-mode";

export function ComposePost() {
  const { mode, setMode } = useComposeMode();
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
        {mode == "poll" ? <PollComposeView /> : <PostComposeView />}
      </div>
    </div>
  );
}
