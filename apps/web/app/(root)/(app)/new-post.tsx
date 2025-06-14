"use client";

import { CircularProgress } from "@/components/circular-progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { ChartBarIcon, ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Image Modal
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
  files: FileWithObjectURL[];
  removeFile: (idx: number) => void;
}) {
  if (files.length === 0) {
    return null;
  }
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalState, setPreviewModalState] = useState(false);

  const handleModalToggle = useCallback(
    (open: boolean) => {
      setPreviewModalState(open);
      if (!open) {
        setSelectedImage(null);
      }
    },
    [setPreviewModalState],
  );

  const handleImageClick = useCallback(
    (url: string) => {
      setSelectedImage(url);
      handleModalToggle(true);
    },
    [handleModalToggle, setSelectedImage],
  );

  return (
    <div
      className={cn("grid mt-2 items-center gap-2", {
        "grid-cols-1": files.length == 1,
        "grid-cols-2": files.length >= 2,
      })}
    >
      {files.map((file, idx) => (
        <FileItem
          key={file.url}
          file={file.file}
          url={file.url}
          index={idx}
          onRemove={removeFile}
          onImageClick={handleImageClick}
        />
      ))}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isOpen={previewModalState}
          onToggle={setPreviewModalState}
        />
      )}
    </div>
  );
}

function FileItem({
  file,
  url,
  onRemove,
  onImageClick,
  index,
}: {
  file: File;
  url: string;
  index: number;
  onRemove: (idx: number) => void;
  onImageClick: (url: string) => void;
}) {
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(index);
    },
    [onRemove, index],
  );
  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onImageClick(url);
    },
    [onImageClick, url],
  );
  const uploadStartRef = useRef<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const uploadFile = useCallback(async () => {
    if (uploadStartRef.current || uploading || uploaded) {
      return;
    }
    uploadStartRef.current = true;
    setUploading(true);
    setUploaded(false);
    const res = await apiClient.post("/upload/signature", {});
    const data = res.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", data.signature);
    formData.append("timestamp", data.timestamp);
    formData.append("folder", data.folder);
    formData.append("api_key", data.apiKey);
    formData.append("context", data.context);
    await apiClient.post(data.uploadUrl, formData, {
      onUploadProgress: (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      },
      adapter: "xhr",
    });
    setUploading(false);
    setProgress(100);
    setUploaded(true);
  }, [file, uploading, uploaded]);

  useEffect(() => {
    uploadFile();
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden group h-full w-full cursor-pointer",
      )}
      key={url}
      onClick={handleImageClick}
    >
      <Button
        variant="secondary"
        className="rounded-full absolute top-2 right-2 z-10 size-6"
        onClick={handleRemove}
      >
        <XIcon className="size-4" />
      </Button>
      {file.type.startsWith("image/") ? (
        <img src={url} className="object-cover w-full h-full rounded-md" />
      ) : (
        <video
          src={url}
          className="object-cover w-full h-full rounded-md"
          controls={true}
        />
      )}
      {uploading && !uploaded && (
        <div className="absolute inset-0 bg-black/30 flex flex-col gap-4 items-center justify-center text-accent">
          <div className="relative">
            <CircularProgress progress={progress} strokeWidth={4} size={72} />
            <div className="left-1/2 -translate-x-1/2 font-semibold text-sm absolute top-1/2 -translate-y-1/2 text-nowrap">
              <span className="text-2xl">{progress}</span>
              <span className="text-xs">%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type FileWithObjectURL = {
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

  const [files, setFiles] = useState<FileWithObjectURL[]>([]);
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
        const selectedFilesWithUrls = selectedFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
        setFiles((prevFiles) => [...prevFiles, ...selectedFilesWithUrls]);
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
