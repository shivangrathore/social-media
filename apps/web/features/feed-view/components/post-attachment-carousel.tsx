"use client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AttachmentFile } from "@/types/post";
export function PostAttachmentCarousel({
  attachments,
}: {
  attachments: AttachmentFile[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
    align: "start",
    slidesToScroll: 1,
  });

  const [scrollSnap, setScrollSnap] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setScrollSnap(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, setScrollSnap]);

  return (
    <div className="overflow-hidden">
      <div className="relative" ref={emblaRef}>
        <div className="flex">
          {attachments.map((attachment, index) => (
            <div className="grow-0 shrink-0 basis-full min-w-0" key={index}>
              {attachment.resource_type === "video" ? (
                <video
                  className="object-cover rounded-md"
                  controls
                  width={600}
                  height={500}
                  src={attachment.url}
                />
              ) : (
                <Image
                  key={index}
                  src={attachment.url}
                  alt="Post Attachment"
                  width={600}
                  height={500}
                  className="object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-10 space-x-2">
          {scrollSnap.map((_, index) => (
            <button
              className={cn("rounded-full p-1 border-gray-600 border", {
                "bg-gray-600": index == selectedIndex,
              })}
              key={index}
              onClick={() => {
                console.log("Shit is clicked");
                console.log(index, emblaApi);
                emblaApi?.scrollTo(index, false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
