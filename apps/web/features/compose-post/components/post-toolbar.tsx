import { Button } from "@/components/ui/button";
import { ImageIcon, SmileIcon } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useStore } from "zustand";
import { uploadStore } from "../store/uploadStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Emoji } from "frimousse";
import { postStore } from "../store/postStore";

function CreateButton() {
  const content = useStore(postStore, (state) => state.post.content);
  const attachments = useStore(postStore, (state) => state.post.attachments);
  const isEmpty = useMemo(() => {
    return (content && content.trim() === "") || attachments.length === 0;
  }, [content, attachments]);

  const publishPost = useStore(postStore, (state) => state.publishPost);
  const handleClick = useCallback(() => {
    if (!isEmpty) {
      publishPost();
    }
  }, [isEmpty, publishPost]);

  return (
    <Button
      size="sm"
      variant="default"
      className="ml-auto"
      disabled={isEmpty}
      onClick={handleClick}
    >
      <span>Post</span>
    </Button>
  );
}

export default function PostToolbar() {
  const addFiles = useStore(uploadStore, (state) => state.addFiles);
  const setContent = useStore(postStore, (state) => state.setContent);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = React.useState(false);
  const classNames =
    "rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors mr-2";
  const fileUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;
    input.onchange = (e) => {
      const element = e.target as HTMLInputElement;
      const files = element.files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        addFiles(fileArray);
      }
    };
    input.click();
  }, [addFiles]);
  const emojiSelect = useCallback(
    (emoji: Emoji) => {
      const content = postStore.getState().post.content;
      let newContent = content || "";
      if (newContent.endsWith(" ")) {
        newContent = newContent.slice(0, -1);
      }
      setContent(newContent + " " + emoji.emoji);
      setEmojiPickerOpen(false);
    },
    [setContent, setEmojiPickerOpen],
  );
  return (
    <div className="flex items-center mt-2 mx-2">
      <div className="">
        <button className={classNames} onClick={fileUpload}>
          <ImageIcon className="size-5" />
        </button>
        <Popover open={isEmojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <button className={classNames}>
              <SmileIcon className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0">
            <EmojiPicker className="h-[342px]" onEmojiSelect={emojiSelect}>
              <EmojiPickerSearch />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>
      </div>
      <CreateButton />
    </div>
  );
}
