"use client";
import { apiClient } from "@/lib/apiClient";
import { create } from "zustand";

export type UploadFile = {
  id: string;
  file: File;
  url: string;
  uploaded: boolean;
  progress: number;
};

type AttachmentUploadStore = {
  files: UploadFile[];
  addFiles: (postId: string, files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  markUploaded: (id: string) => void;
  setFiles?: (files: UploadFile[]) => void;
};

export const postAttachmentStore = create<AttachmentUploadStore>(
  (set, get) => ({
    files: [],
    markUploaded: (id: string) => {
      set((state) => {
        const files = state.files.map((file) =>
          file.id === id ? { ...file, uploaded: true } : file,
        );
        return { files };
      });
    },
    setFiles: (files: UploadFile[]) => {
      set({ files });
    },
    addFiles: async (postId: string, files: File[]) => {
      const newUploads = files.map((file) => {
        return {
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
          uploaded: false,
          progress: 0,
        };
      });
      const signatureRequest = await apiClient.post("/upload/signature", {
        postId,
      });
      const data = signatureRequest.data;
      set((state) => {
        return { files: [...state.files, ...newUploads] };
      });
      newUploads.forEach(async (upload) => {
        const formData = new FormData();
        formData.append("file", upload.file);
        formData.append("signature", data.signature);
        formData.append("api_key", data.apiKey);
        formData.append("folder", data.folder);
        formData.append("timestamp", data.timestamp);
        formData.append("context", data.context);
        await apiClient.post(data.uploadUrl, formData, {
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              get().updateProgress(upload.id, percent);
            }
          },
          adapter: "xhr",
        });
        get().updateProgress(upload.id, 100);
        get().markUploaded(upload.id);
      });
    },
    removeFile: (id: string) => {
      set((state) => {
        const files = state.files.filter((file) => file.id !== id);
        return { files };
      });
    },
    updateProgress: (id: string, progress: number) => {
      set((state) => {
        const files = state.files.map((file) =>
          file.id === id ? { ...file, progress } : file,
        );
        return { files };
      });
    },
  }),
);
