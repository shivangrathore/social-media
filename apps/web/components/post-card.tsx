"use client";
import Image from "next/image";
import { UserProfile } from "./user-profile";
import { BookmarkIcon, HeartIcon, MessageCircle, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function PostAttachmentCarousel() {
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
          {new Array(5).fill(0).map((_, index) => (
            <div className="grow-0 shrink-0 basis-full min-w-0" key={index}>
              <Image
                key={index}
                src="https://placehold.co/600x500.png"
                alt="Post Attachment"
                width={600}
                height={500}
                className="object-cover rounded-md"
              />
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

export function PostCard({
  showContent = true,
  showImage = true,
}: {
  showContent?: boolean;
  showImage?: boolean;
}) {
  // TODO: use owl carousel
  return (
    <div className="w-[500px] border border-border rounded-md bg-white flex flex-col">
      <div className="flex gap-2 items-center border-b p-2 px-4">
        <UserProfile />
      </div>
      {showContent && (
        <div className="p-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam quis
            soluta temporibus laudantium, totam optio tenetur neque. Molestias,
            unde assumenda!
          </p>
        </div>
      )}
      {/* {showImage && ( */}
      {/*   <div className="relative p-4"> */}
      {/*     <div className="w-full h-[300px] relative"> */}
      {/*       <Image */}
      {/*         src="https://placehold.co/600x500.png" */}
      {/*         alt="Post Image" */}
      {/*         fill */}
      {/*         className="object-cover rounded-md" */}
      {/*       /> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}
      <PostAttachmentCarousel />
      <hr className="my-2 mt-0" />
      <div className="flex px-4 py-2">
        <button className="p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer text-gray-800">
          <HeartIcon className="size-5" />
        </button>
        <button className="text-gray-800 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <MessageCircle className="size-5" />
        </button>
        <button className="text-gray-800 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <SendIcon className="size-5" />
        </button>
        <Button variant="secondary" className="ml-auto">
          <BookmarkIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
