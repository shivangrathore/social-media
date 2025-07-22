import { Attachment } from "@repo/types";
import { UploadFile } from "../types";
import { CircularProgress } from "@/components/circular-progress";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function AttachmentGrid({
  attachments,
  uploadingFiles,
  removeUploadingFile,
  removeAttachment,
}: {
  attachments: Attachment[];
  uploadingFiles: UploadFile[];
  removeUploadingFile: (file: string) => void;
  removeAttachment: (attachment: number) => void;
}) {
  const count = attachments.length + uploadingFiles.length;
  const hasAttchments = count > 0;
  if (!hasAttchments) {
    return null;
  }

  const onRemove = (file: Attachment | UploadFile) => {
    if ("progress" in file) {
      if (file.attachment) {
        removeAttachment(file.attachment.id);
      }
      removeUploadingFile(file.id);
    } else {
      removeAttachment(file.id);
    }
  };

  return (
    <div className={"grid grid-cols-2 gap-2 mt-2 h-fit"}>
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          onRemove={() => onRemove(attachment)}
        />
      ))}
      {uploadingFiles.map((file) => (
        <UploadingFileItem
          key={file.id}
          file={file}
          onRemove={() => onRemove(file)}
        />
      ))}
    </div>
  );
}

type AttachmentItemProps = {
  attachment: Attachment;
  onRemove?: () => void;
};

function AttachmentItem({ attachment, onRemove }: AttachmentItemProps) {
  return (
    <Container onRemove={onRemove}>
      {attachment.type.startsWith("image") ? (
        <img
          src={
            "https://minio.shivang.tech/social-connect/" + attachment.assetId
          }
          alt=""
          className="object-cover h-full w-full"
        />
      ) : (
        <video
          src={
            "https://minio.shivang.tech/social-connect/" + attachment.assetId
          }
          controls
          className="w-full h-full object-cover"
        />
      )}
    </Container>
  );
}

type UploadingFileItemProps = {
  onRemove?: () => void;
  file: UploadFile;
};

function UploadingFileItem({ file, onRemove }: UploadingFileItemProps) {
  const isImage = file.file.type.startsWith("image/");

  return (
    <Container onRemove={onRemove}>
      {isImage ? (
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.file.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <video src={file.url} controls className="w-full h-full object-cover" />
      )}

      {!file.uploaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <CircularProgress
            size={40}
            progress={file.progress}
            strokeWidth={4}
          />
        </div>
      )}
    </Container>
  );
}

function Container({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="relative h-full w-full rounded-lg last:odd:col-span-2 overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <Button
          onClick={onRemove}
          size="icon"
          variant="secondary"
          type="button"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}
