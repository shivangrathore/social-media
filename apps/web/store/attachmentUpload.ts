"use client";
import { create, useStore } from "zustand";

type UploadFile = {
  id: string;
  file: File;
  url: string;
  uploaded: boolean;
  progress: number;
};

type AttachmentUploadStore = {
  files: UploadFile[];
  addFile: (file: File) => void;
  removeFile: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  markUploaded: (id: string) => void;
};

export const attachmentUploadStore = create<AttachmentUploadStore>((set) => ({
  files: [],
  markUploaded: (id: string) => {
    set((state) => {
      const files = state.files.map((file) =>
        file.id === id ? { ...file, uploaded: true } : file,
      );
      return { files };
    });
  },
  addFile: (file: File) => {
    const id = crypto.randomUUID();
    const url = URL.createObjectURL(file);
    set((state) => ({
      files: [...state.files, { id, file, url, uploaded: false, progress: 0 }],
    }));
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
}));
