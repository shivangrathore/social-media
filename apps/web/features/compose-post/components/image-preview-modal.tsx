"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ImageModalProps = {
  image: string;
  isOpen: boolean;
  onToggle(v: boolean): void;
};

export function ImagePreviewModal({
  image,
  isOpen,
  onToggle,
}: ImageModalProps) {
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
