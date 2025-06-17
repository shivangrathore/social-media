import { Button } from "@/components/ui/button";
import { ChartBarIcon, ImageIcon, SmileIcon } from "lucide-react";
import { useCallback } from "react";
import { useStore } from "zustand";
import { uploadStore } from "../store/uploadStore";

export default function PostToolbar() {
  const addFiles = useStore(uploadStore, (state) => state.addFiles);
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
  const actions = {
    file: fileUpload,
    emoji: () => {},
    poll: () => {},
  };
  return (
    <div className="flex items-center mt-2 mx-2">
      <div className="">
        {[
          { icon: ImageIcon, action: actions.file },
          { icon: SmileIcon, action: actions.emoji },
          { icon: ChartBarIcon, action: actions.poll },
        ].map((item, idx) => (
          <button
            key={idx}
            className="rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors mr-2"
            onClick={item.action}
          >
            <item.icon className="size-5" />
          </button>
        ))}
      </div>
      <Button
        size="sm"
        variant="default"
        className="ml-auto"
        // disabled={isEmpty}
      >
        <span>Post</span>
      </Button>
    </div>
  );
}
