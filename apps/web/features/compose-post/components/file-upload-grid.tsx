"use client";
import { cn } from "@/lib/utils";
import { FileItem } from "./file-item";
import { useStore } from "zustand";
import { postStore } from "../store/postStore";
import { useCallback, useMemo, useState } from "react";
import { attachmentAdapter } from "../utils";
import { ImagePreviewModal } from "./image-preview-modal";
import { uploadStore } from "../store/uploadStore";

export function FileUploadGrid() {
  const attachments = useStore(postStore, (state) => state.post.attachments);
  const uploadFiles = useStore(uploadStore, (state) => state.files);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const toggleImageModal = (open: boolean) => {
    if (!open) {
      setSelectedImage(null);
    }
    setIsImageModalOpen(open);
  };

  const files = useMemo(
    () =>
      [...attachments, ...uploadFiles].map((attachment) =>
        attachmentAdapter(attachment),
      ),
    [attachments, uploadFiles],
  );

  const onImageClick = useCallback(
    (id: string) => {
      const image = files.find((att) => att.id === id);
      if (image) {
        setSelectedImage(attachmentAdapter(image).url);
        toggleImageModal(true);
      }
    },
    [files],
  );

  if (files.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("grid mt-2 items-center gap-2", {
        "grid-cols-2": files.length >= 2,
      })}
      role="group"
      aria-label="Uploaded Files"
    >
      {files.map((file) => (
        <FileItem
          key={`${["attachment", "upload"][+file.isAttachment]}:${file.id}`}
          file={file}
          onRemove={() => {}}
          onImageClick={onImageClick}
        />
      ))}
      {isImageModalOpen && selectedImage && (
        <ImagePreviewModal
          image={selectedImage}
          isOpen={isImageModalOpen}
          onToggle={toggleImageModal}
        />
      )}
    </div>
  );
}
