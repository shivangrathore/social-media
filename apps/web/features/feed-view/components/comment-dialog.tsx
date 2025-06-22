"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@repo/api-types";
import { MessageCircle } from "lucide-react";
import { PostCommentForm } from "./post-comment-form";
import React, { useCallback } from "react";

export function CommentDialog({
  author,
  content,
  postId,
  addComment,
}: {
  author: User;
  content: string | null;
  postId: number;
  addComment(content: string): Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const closeDialog = () => setOpen(false);
  const onCommentAdd = useCallback(
    async (content: string) => {
      await addComment(content);
      closeDialog();
    },
    [addComment],
  );
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
          <MessageCircle className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Replying to</DialogTitle>
        <DialogDescription className="hidden">Add a comment</DialogDescription>
        <div className="flex flex-col relative">
          <div className="flex gap-2 items-start">
            <Avatar className="size-12">
              <AvatarImage />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold text-gray-300">
                {author.firstName + " " + author.lastName}
              </p>
              <p className="text-gray-400">@{author.username}</p>
            </div>
          </div>
          <div className="relative -mt-6 min-h-[3rem]">
            <p className="text-sm pl-14">{content}</p>
            <div className="w-0.5 bg-gray-400 h-[calc(100%-1.5rem)] top-0 left-6 absolute mt-6" />
          </div>
          <div className="flex gap-2">
            <Avatar className="size-12">
              <AvatarImage />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <PostCommentForm postId={postId} onCommentAdd={onCommentAdd} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
