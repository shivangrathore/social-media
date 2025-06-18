import { cn } from "@/lib/utils";
import { AttachmentFile } from "@repo/api-types";

export default function PostAttachmentGrid({
  attachments,
}: {
  attachments: AttachmentFile[];
}) {
  return (
    <div className="px-4 mb-2">
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
            {attachment.resource_type === "image" ? (
              <img
                src={attachment.url}
                alt=""
                className="w-full h-auto object-cover"
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
