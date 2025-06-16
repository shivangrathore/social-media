"use client";
import { CircularProgress } from "@/components/circular-progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { postAttachmentStore, UploadFile } from "@/store/attachmentUpload";
import { Attachment, createPostStore, loadDraftPost } from "@/store/createPost";
import { ChartBarIcon, ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { ImageModal } from "./image-view-modal";

// TODO: Use carousel for images and videos upload view
function ImageUploadView() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewModalState, setPreviewModalState] = useState(false);
  const files = useStore(postAttachmentStore, (state) => state.files);
  const removeFile = useStore(postAttachmentStore, (state) => state.removeFile);

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

  const attachments = useStore(createPostStore, (state) => state.attachments);

  const fileViewFiles = useMemo(() => {
    return [...attachments.map(adaptAttachmentToUploadFile), ...files];
  }, [files, attachments]);
  return (
    <div
      className={cn("grid mt-2 items-center gap-2", {
        "grid-cols-1": fileViewFiles.length == 1,
        "grid-cols-2": fileViewFiles.length >= 2,
      })}
    >
      {fileViewFiles.map((file) => (
        <FileItem
          key={file.id}
          file={file}
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

type AttachmentAdapter = {
  id: string;
  url: string;
  file: { type: string };
  progress: number;
  uploaded: boolean;
  isAttachment: boolean;
};

function adaptAttachmentToUploadFile(
  attachment: Attachment,
): AttachmentAdapter {
  return {
    id: attachment.id,
    url: attachment.url,
    file: {
      type: attachment.resource_type?.startsWith("image")
        ? "image/jpeg"
        : "video/mp4",
    },
    progress: 100,
    uploaded: true,
    isAttachment: true,
  };
}

function FileItem({
  file,
  onRemove,
  onImageClick,
}: {
  file: UploadFile | AttachmentAdapter;
  onRemove: (id: string) => void;
  onImageClick: (url: string) => void;
}) {
  const isAttachment = "isAttachment" in file && file.isAttachment;
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(file.id);
    },
    [onRemove, file.id],
  );
  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onImageClick(file.url);
    },
    [onImageClick, file.url],
  );

  const isImage = file.file.type.startsWith("image/");
  const isVideo = file.file.type.startsWith("video/");

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden group h-full w-full cursor-pointer",
      )}
      key={file.id}
      onClick={handleImageClick}
    >
      <Button
        variant="secondary"
        className="rounded-full absolute top-2 right-2 z-10 size-6"
        onClick={handleRemove}
      >
        <XIcon className="size-4" />
      </Button>
      {isImage && (
        <img src={file.url} className="object-cover w-full h-full rounded-md" />
      )}
      {isVideo && (
        <video
          src={file.url}
          className="object-cover w-full h-full rounded-md"
          controls={true}
        />
      )}

      {!file.uploaded && file.progress > 0 && (
        <div className="absolute inset-0 bg-black/30 flex flex-col gap-4 items-center justify-center text-accent">
          <div className="relative">
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
    </div>
  );
}

// Try https://frimousse.liveblocks.io/ emoji picker
export function CreateNewPost() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const post = useStore(
    createPostStore,
    useShallow((state) => ({
      content: state.content,
      id: state.id,
    })),
  );
  const files = useStore(postAttachmentStore, (state) => state.files);
  const addFiles = useStore(postAttachmentStore, (state) => state.addFiles);
  const setContent = useStore(createPostStore, (state) => state.setContent);
  const isEmpty = useMemo(() => {
    return post.content?.trim().length === 0 && files.length === 0;
  }, [post.content, files]);
  const isPostLoading = useStore(
    createPostStore,
    (state) => state.isPostLoading,
  );

  // Callbacks
  const createDraftPost = useCallback(async () => {
    if (post.id) {
      return;
    }
    const res = await apiClient.post("/posts/draft");
    if (res.data) {
      createPostStore.setState({
        id: res.data.id,
        content: res.data.content || "",
      });
    }
  }, [post.id]);
  const updateTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const textAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      updateTextareaHeight();
    },
    [],
  );

  const uploadFiles = useCallback(() => {
    if (!post || !post.id) {
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,video/*";
    input.click();
    input.onchange = (e) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      if (target.files) {
        addFiles(post.id!, Array.from(target.files));
      }
      input.remove();
    };
    input.onabort = () => {
      console.warn("File upload was aborted.");
    };
  }, [post]);

  const backupPost = useCallback(async () => {
    if (!post || !post.id) {
      return;
    }
    await apiClient.patch(`/posts/${post.id}`, {
      content: post.content,
    });
  }, [post]);

  // Effects
  useEffect(() => {
    loadDraftPost();
  }, []);

  useEffect(() => {
    updateTextareaHeight();
  }, [post.content]);

  useEffect(() => {
    if (!post || !post.id) {
      return;
    }
    const timeout = setTimeout(() => {
      backupPost();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [post.content, backupPost]);

  return (
    <div className="my-6 p-4 bg-white">
      {isPostLoading ? (
        <div>
          <Skeleton className="h-14 w-full mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} className="size-8 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-14 rounded-md" />
          </div>
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={post.content || ""}
            onChange={textAreaChange}
            ref={textareaRef}
            className="p-4 rounded-lg border border-border w-full resize-none overflow-hidden text-base"
            placeholder="What's on your mind?"
            rows={1}
            onFocus={createDraftPost}
          />
          <ImageUploadView />
          <div className="flex items-center mt-2 mx-2">
            <div className="">
              <button
                className="rounded-full text-primary p-2 cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={uploadFiles}
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
      )}
    </div>
  );
}
