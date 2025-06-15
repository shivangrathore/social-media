"use client";

import { CircularProgress } from "@/components/circular-progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { postAttachmentStore, UploadFile } from "@/store/attachmentUpload";
import { createPostStore } from "@/store/createPost";
import { ChartBarIcon, ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";

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

  return (
    <div
      className={cn("grid mt-2 items-center gap-2", {
        "grid-cols-1": files.length == 1,
        "grid-cols-2": files.length >= 2,
      })}
    >
      {files.map((file) => (
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

function FileItem({
  file,
  onRemove,
  onImageClick,
}: {
  file: UploadFile;
  onRemove: (id: string) => void;
  onImageClick: (url: string) => void;
}) {
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
      {file.file.type.startsWith("image/") ? (
        <img src={file.url} className="object-cover w-full h-full rounded-md" />
      ) : (
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
export function NewPost() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function updateTextareaHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }
  useEffect(() => {
    loadDraftPost();
  }, []);

  const files = useStore(postAttachmentStore, (state) => state.files);
  const addFiles = useStore(postAttachmentStore, (state) => state.addFiles);
  const post = useStore(createPostStore, (state) => state.post);
  const setPost = useStore(createPostStore, (state) => state.setPost);

  const loadDraftPost = useStore(
    createPostStore,
    (state) => state.loadDraftPost,
  );

  useEffect(() => {
    setBody(post?.content || "");
  }, [post]);

  const [body, setBody] = useState("");

  function textAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);
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
        addFiles(Array.from(target.files));
      }
      input.remove();
    };
  }

  useEffect(() => {
    updateTextareaHeight();
  }, [body]);

  const updateDraftPost = useCallback(
    async (body: string) => {
      if (!post) {
        return;
      }
      await apiClient.patch(`/posts/${post.id}`, {
        content: body,
      });
      console.log("Draft post updated", body);
    },
    [post],
  );
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await updateDraftPost(body);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [body, updateDraftPost]);

  const isEmpty = useMemo(() => {
    return body.trim().length === 0 && files.length === 0;
  }, [body, files]);

  const createDraftPost = useCallback(async () => {
    const res = await apiClient.post("/posts", {});
    setPost(res.data);
  }, []);

  const isPostLoading = useStore(
    createPostStore,
    (state) => state.isPostLoading,
  );

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
            value={body}
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
      )}
    </div>
  );
}
