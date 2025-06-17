import { create } from "zustand";
import { UploadFile } from "../types";
import { apiClient } from "@/lib/apiClient";
import { postStore } from "./postStore";

type UploadStore = {
  files: UploadFile[];
  addFiles: (files: File[]) => Promise<void>;
  updateProgress: (id: string, progress: number) => void;
  markUploaded: (id: string) => void;
};

export const uploadStore = create<UploadStore>((set, get) => ({
  files: [],
  updateProgress: (id: string, progress: number) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, progress } : file,
      ),
    }));
  },
  markUploaded: (id: string) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploaded: true } : file,
      ),
    }));
  },
  addFiles: async (files: File[]) => {
    const postId = postStore.getState().post.id;
    const newFiles = files.map(
      (file) =>
        ({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file),
          file,
          progress: 0,
          uploaded: false,
        }) as UploadFile,
    );
    set((state) => ({
      files: [...state.files, ...newFiles],
    }));

    const signatureRequest = await apiClient.post("/upload/signature", {
      postId,
    });
    const signatureData = signatureRequest.data;

    newFiles.forEach(async (uploadFile) => {
      const formData = new FormData();
      formData.append("file", uploadFile.file);
      formData.append("signature", signatureData.signature);
      formData.append("api_key", signatureData.apiKey);
      formData.append("folder", signatureData.folder);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("context", signatureData.context);

      try {
        const response = await apiClient.post(
          signatureData.uploadUrl,
          formData,
          {
            onUploadProgress: (event) => {
              if (event.total) {
                const progress = Math.round((event.loaded * 100) / event.total);
                get().updateProgress(uploadFile.id, progress);
              }
            },
            adapter: "xhr",
          },
        );
        get().markUploaded(uploadFile.id);
        get().updateProgress(uploadFile.id, 100);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  },
}));
