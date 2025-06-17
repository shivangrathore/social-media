"use client";

import type React from "react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/circular-progress";
import { XIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileAdapter } from "../types";

export interface FileItemProps {
  file: FileAdapter;
  onRemove(id: string): void;
  onImageClick(id: string): void;
}

export function FileItem({
  file,
  onRemove,
  onImageClick,
}: FileItemProps): React.JSX.Element {
  const isImage = file.isAttachment
    ? file.resource_type == "image"
    : file.file.type.startsWith("image/");

  const isVideo = file.isAttachment
    ? file.resource_type == "video"
    : file.file.type.startsWith("video/");

  const fileName = file.isAttachment
    ? file.public_id
    : file.file.name || "file";

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(file.id);
    },
    [file, onRemove],
  );
  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isImage) onImageClick(file.id);
    },
    [isImage, file.id],
  );

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden group h-full w-full cursor-pointer",
        isImage &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500",
      )}
      onClick={handleImageClick}
      tabIndex={isImage ? 0 : -1}
      role={isImage ? "button" : undefined}
      aria-label={isImage ? `Preview ${fileName}` : undefined}
    >
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full absolute top-2 right-2 z-10 size-6 p-0 opacity-80 hover:opacity-100"
        onClick={handleRemove}
        aria-label={`Remove ${fileName}`}
      >
        <XIcon className="size-4" />
      </Button>

      {isImage && (
        <img
          src={file.url}
          alt={fileName}
          className="object-cover w-full h-full rounded-md"
        />
      )}

      {isVideo && (
        <video
          src={file.url}
          className="object-cover w-full h-full rounded-md"
          controls
          aria-label={`Video: ${fileName}`}
        />
      )}

      {!file.isAttachment && !file.uploaded && file.progress > 0 && (
        <div className="absolute inset-0 bg-black/50 flex flex-col gap-2 items-center justify-center text-white">
          <div
            className="relative flex items-center justify-center"
            role="progressbar"
            aria-valuenow={file.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <CircularProgress
              progress={file.progress}
              strokeWidth={4}
              size={72}
            />
            <div className="left-1/2 -translate-x-1/2 font-semibold text-sm absolute top-1/2 -translate-y-1/2 text-nowrap">
              <span className="text-2xl">{file.progress}</span>
              <span className="text-xs">%</span>
            </div>
          </div>
        </div>
      )}

      {!file.isAttachment && !file.uploaded && file.progress === 0 && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="size-8 animate-spin" />
            <div className="text-xs opacity-80">Preparing...</div>
          </div>
        </div>
      )}
    </div>
  );
}
