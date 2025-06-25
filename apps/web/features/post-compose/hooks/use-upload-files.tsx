"use client";

import { useState } from "react";
import { getUploadSignature } from "../api/upload";
import { apiClient } from "@/lib/apiClient";
import { AxiosProgressEvent } from "axios";

type UploadFile = {
  id: string;
  file: File;
  progress: number;
  url: string;
  uploaded: boolean;
  attachmentId?: number;
};

type UploadFilesHookProps = {
  onAttachmentUploaded?: (file: any) => Promise<number | undefined>;
};
export function useUploadFiles({ onAttachmentUploaded }: UploadFilesHookProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
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
    await Promise.all(
      files.map(async (file) => {
        const { signature, apiKey, folder, timestamp, context, uploadUrl } =
          await getUploadSignature(postId);
        const formData = new FormData();
        formData.append("file", file.file);
        formData.append("signature", signature);
        formData.append("api_key", apiKey);
        formData.append("folder", folder);
        formData.append("timestamp", timestamp);
        formData.append("context", context);

        const response = await apiClient.post(uploadUrl, formData, {
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

        const data = await response.data;

        const attachmentId = await onAttachmentUploaded?.(data);
        updateFile({
          ...file,
          uploaded: true,
          attachmentId,
        });
      }),
    );
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
  return {
    files,
    addFiles,
  };
}
