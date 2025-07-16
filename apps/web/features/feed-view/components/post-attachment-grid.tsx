import { cn } from "@/lib/utils";
import { Attachment } from "@repo/types";

export default function PostAttachmentGrid({
  attachments,
  className,
}: {
  attachments: Attachment[];
  className?: string;
}) {
  return (
    <div className={cn("mb-2", className)}>
      <div className="grid grid-cols-2 overflow-hidden gap-px rounded-2xl max-h-[700px]">
        {attachments.map((attachment, index) => (
          <div
            key={attachment.id}
            className={cn(
              "relative overflow-hidden",
              index == attachments.length - 1 && index % 2 == 0
                ? "col-span-2"
                : "col-span-1",
            )}
          >
            {attachment.type === "image" ? (
              <img
                src={attachment.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={attachment.url}
                controls
                className="w-full h-auto object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
