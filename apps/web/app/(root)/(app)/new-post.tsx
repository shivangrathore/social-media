"use client";

import { Button } from "@/components/ui/button";
import { ChartBarIcon, ImageIcon, SmileIcon, VideoIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export function NewPost() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function updateTextareaHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }
  return (
    <div className="my-6 p-4 bg-white">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="p-4 rounded-lg border border-border w-full resize-none overflow-hidden"
          placeholder="What's on your mind?"
          rows={1}
          onChange={updateTextareaHeight}
        />
        <div className="flex items-center mt-2 mx-2">
          <div className="">
            {[
              { icon: ImageIcon },
              { icon: VideoIcon },
              { icon: SmileIcon },

              { icon: ChartBarIcon },
            ].map((i, idx) => (
              <button
                className="rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors"
                key={idx}
              >
                <i.icon className="size-5" />
              </button>
            ))}
          </div>
          <Button size="sm" variant="default" className="ml-auto" disabled>
            <span>Post</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
