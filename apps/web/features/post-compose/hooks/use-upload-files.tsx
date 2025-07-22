"use client";

import { useState } from "react";
import { addAttachment } from "../api/upload";
import axios, { AxiosProgressEvent } from "axios";
import { CreateAttachmentResponse } from "@repo/types";

type UploadFile = {
  id: string;
  file: File;
  progress: number;
  url: string;
  uploaded: boolean;
  attachment?: CreateAttachmentResponse;
};

export function useUploadFiles() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const updateFile = (file: UploadFile) => {
    setFiles((prev) => {
      const existingFileIndex = prev.findIndex((f) => f.id === file.id);
      if (existingFileIndex !== -1) {
        const updatedFiles = [...prev];
        updatedFiles[existingFileIndex] = file;
        return updatedFiles;
      }
      return [...prev, file];
    });
  };
  const uploadFiles = async (postId: number, files: UploadFile[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    await Promise.all(
      files.map(async (file) => {
        const attach = await addAttachment(file.file.type, postId);
        const formData = new FormData();
        Object.entries(attach.fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", file.file);
        await axios.post(attach.uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          adapter: "xhr",
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            updateFile({
              ...file,
              progress,
            });
          },
        });

        updateFile({
          ...file,
          uploaded: true,
          attachment: attach,
        });
      }),
    );
    setIsUploading(false);
  };
  const addFiles = async (postId: number, ...newFiles: File[]) => {
    const nfiles = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      url: URL.createObjectURL(file),
      uploaded: false,
    }));
    setFiles((prev) => [...prev, ...nfiles]);
    await uploadFiles(postId, nfiles);
  };

  const reset = () => {
    setFiles([]);
    setIsUploading(false);
  };

  const remove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return {
    files,
    addFiles,
    isUploading,
    reset,
    remove,
  };
}
