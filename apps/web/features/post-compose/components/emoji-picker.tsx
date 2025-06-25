"use client";

import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmileIcon, SmilePlusIcon } from "lucide-react";
import { useState } from "react";

export default function EmojiPickerForContent({
  emojiSelect,
  className,
}: {
  emojiSelect(emoji: string): void;
  className?: string;
}) {
  const handleEmojiSelect = (emoji: { emoji: string }) => {
    emojiSelect(emoji.emoji);
    setEmojiPickerOpen(false);
  };
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  return (
    <Popover open={isEmojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
      <PopoverTrigger asChild>
        <button className={className}>
          <SmilePlusIcon className="size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <EmojiPicker className="h-[342px]" onEmojiSelect={handleEmojiSelect}>
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
