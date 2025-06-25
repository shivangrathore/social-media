import { AttachmentFile } from "@repo/api-types";
import { UploadFile } from "../types";
import { CircularProgress } from "@/components/circular-progress";

export function AttachmentGrid({
  attachments,
  uploadingFiles,
}: {
  attachments: AttachmentFile[];
  uploadingFiles: UploadFile[];
}) {
  const count = attachments.length + uploadingFiles.length;
  const hasAttchments = count > 0;
  if (!hasAttchments) {
    return null;
  }

  return (
    <div className={"grid grid-cols-2 gap-2 mt-2"}>
      {attachments.map((attachment) => (
        <AttachmentItem key={attachment.id} attachment={attachment} />
      ))}
      {uploadingFiles.map((file) => (
        <UploadingFileItem key={file.id} file={file} />
      ))}
    </div>
  );
}

type AttachmentItemProps = {
  attachment: AttachmentFile;
};

function AttachmentItem({ attachment }: AttachmentItemProps) {
  return (
    <Container>
      {attachment.type === "image" ? (
        <img
          src={attachment.url || "/placeholder.svg"}
          alt=""
          className="object-cover h-full w-full"
        />
      ) : (
        <video
          src={attachment.url}
          controls
          className="w-full h-auto object-cover"
        />
      )}
    </Container>
  );
}

type UploadingFileItemProps = {
  file: UploadFile;
};

function UploadingFileItem({ file }: UploadingFileItemProps) {
  const isImage = file.file.type.startsWith("image/");

  return (
    <Container>
      {isImage ? (
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.file.name}
          className="w-full h-auto rounded-lg"
        />
      ) : (
        <video src={file.url} controls className="w-full h-auto rounded-lg " />
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

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-lg last:odd:col-span-2">{children}</div>
  );
}
