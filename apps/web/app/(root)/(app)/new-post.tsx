"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChartBarIcon, ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

// Image Modal
// FIX: Prevent reloads when not needed
// TODO: Revoke file URLs when not needed
function ImageModal({
  image,
  isOpen,
  onToggle,
}: {
  image: string;
  isOpen: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogContent
        className="!max-w-2xl max-h-[calc(100vh-2rem)] h-full p-4 pt-10"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle className="hidden">{image}</DialogTitle>
        <img
          src={image}
          className="max-w-full max-h-[calc(100vh-10rem)] object-contain mx-auto my-auto rounded-md ring-4 ring-blue-500"
        />
      </DialogContent>
    </Dialog>
  );
}

// TODO: Use carousel for images and videos upload view
function ImageUploadView({
  files,
  removeFile,
}: {
  files: FileWithUrl[];
  removeFile: (idx: number) => void;
}) {
  if (files.length === 0) {
    return null;
  }
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleModalToggle = useCallback((open: boolean) => {
    setImageModalOpen(open);
    if (!open) {
      setSelectedImage(null);
    }
  }, []);

  return (
    <div
      className={cn("grid mt-2 items-center gap-2", {
        "grid-cols-1": files.length == 1,
        "grid-cols-2": files.length >= 2,
      })}
    >
      {files.map((file, idx) => {
        return (
          <div
            className={cn(
              "relative rounded-md overflow-hidden group h-full w-full cursor-pointer",
            )}
            key={file.url}
            onClick={() => {
              setSelectedImage(file.url);
              setImageModalOpen(true);
            }}
          >
            {selectedImage && (
              <ImageModal
                image={selectedImage}
                isOpen={imageModalOpen}
                onToggle={handleModalToggle}
              />
            )}
            <Button
              variant="secondary"
              className="rounded-full absolute top-2 right-2 z-10 size-6"
              onClick={(e) => {
                removeFile(idx);
                e.stopPropagation();
              }}
            >
              <XIcon className="size-4" />
            </Button>
            {file.file.type.startsWith("image/") ? (
              <img
                src={file.url}
                className="object-cover w-full h-full rounded-md"
              />
            ) : (
              <video
                src={file.url}
                className="object-cover w-full h-full rounded-md"
                controls={true}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

type FileWithUrl = {
  file: File;
  url: string;
};

// Try https://frimousse.liveblocks.io/ emoji picker
export function NewPost() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function updateTextareaHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }
  const [body, setBody] = useState("");
  function textAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);
    updateTextareaHeight();
  }

  const [files, setFiles] = useState<FileWithUrl[]>([]);
  function removeFile(idx: number) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== idx));
  }

  function uploadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,video/*";
    input.click();
    input.onchange = (e) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const selectedFiles = Array.from(target.files);
        const fileWithUrls = selectedFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
        setFiles((prevFiles) => [...prevFiles, ...fileWithUrls]);
      }
      input.remove();
    };
  }

  const isEmpty = useMemo(() => {
    return body.trim().length === 0 && files.length === 0;
  }, [body, files]);

  return (
    <div className="my-6 p-4 bg-white">
      <div className="relative">
        <textarea
          value={body}
          onChange={textAreaChange}
          ref={textareaRef}
          className="p-4 rounded-lg border border-border w-full resize-none overflow-hidden text-base"
          placeholder="What's on your mind?"
          rows={1}
        />
        <ImageUploadView files={files} removeFile={removeFile} />
        <div className="flex items-center mt-2 mx-2">
          <div className="">
            <button
              className="rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={uploadFile}
            >
              <ImageIcon className="size-5" />
            </button>
            {[{ icon: SmileIcon }, { icon: ChartBarIcon }].map((i, idx) => (
              <button
                className="rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors"
                key={idx}
              >
                <i.icon className="size-5" />
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="default"
            className="ml-auto"
            disabled={isEmpty}
          >
            <span>Post</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
