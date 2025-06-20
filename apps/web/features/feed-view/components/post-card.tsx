"use client";
import { UserProfile } from "@/components/user-profile";
import {
  BarChart3,
  BookmarkIcon,
  HeartIcon,
  MessageCircle,
  SendIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedEntry } from "@repo/api-types/feed";
import { PollDisplay } from "./poll-display";
import { PostDisplay } from "./post-display";
import { useEffect, useRef } from "react";
import { useLogView } from "../hooks/use-log-view";

export function PostCard({ post }: { post: FeedEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const author = post.author;
  const { logView, isLogged } = useLogView(post.id);
  useEffect(() => {
    if (isLogged) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          logView();
          observer.disconnect();
        }
      },
      { threshold: 1 },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isLogged, logView]);
  return (
    <div
      className="border border-border rounded-md bg-white flex flex-col"
      ref={ref}
    >
      <div className="flex gap-2 items-center border-b p-2 px-4">
        <UserProfile {...author} />
      </div>
      {post.postType === "regular" && <PostDisplay post={post} />}
      {post.postType === "poll" && <PollDisplay poll={post} />}
      <hr className="my-2 mt-0" />
      <div className="flex px-4 py-2 items-center">
        <button className="p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer text-gray-800">
          <HeartIcon className="size-5" />
        </button>
        <button className="text-gray-800 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <MessageCircle className="size-5" />
        </button>
        <button className="text-gray-800 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <SendIcon className="size-5" />
        </button>
        <p className="text-gray-500 text-sm ml-2">{post.views} views</p>

        <Button variant="secondary" className="ml-auto">
          <BookmarkIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
