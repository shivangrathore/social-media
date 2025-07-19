"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/features/chat/hooks/use-chat";
import socket from "@/lib/socket";
import { cn, getInitials } from "@/lib/utils";
import { useUser } from "@/store/auth";
import { useChatStore } from "@/store/chat-store";
import { Chat } from "@repo/types";
import Link from "next/link";
import { useEffect } from "react";

function MessagesList({ chat }: { chat: Chat }) {
  console.log("MessagesList rendered", chat);
  useEffect(() => {
    socket.emit("joinChat", chat.id);
    return () => {};
  }, []);
  const { user } = useUser();
  const messages: any[] = [];
  return (
    <div className="flex-grow overflow-auto h-full flex flex-col gap-2 p-2">
      <div className="flex-grow" />
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-2 p-2 hover:bg-accent/20 rounded-md justify-start",
            message.sender.id === user?.id
              ? "text-right flex-row-reverse"
              : "text-left",
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={message.sender.avatar || undefined} />
            <AvatarFallback>
              {getInitials(message.sender.name || message.sender.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {message.sender.name || message.sender.username}
            </span>
            <span className="text-sm text-gray-500">{message.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesPage({ chat }: { chat: Chat }) {
  const { user } = useUser();
  const otherChatUser = chat.users?.find((u) => u.id !== user?.id);
  if (!otherChatUser) {
    return <div className="p-4">No chat selected</div>;
  }
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex justify-between gap-2 items-center p-2">
        <Link
          href={`/u/${otherChatUser.username}`}
          className="flex gap-2 items-center rounded-md p-2"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherChatUser.avatar || undefined} />
            <AvatarFallback>
              {getInitials(otherChatUser.name || otherChatUser.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{otherChatUser.name}</span>
            <span className="text-xs text-gray-400">
              @{otherChatUser.username}
            </span>
          </div>
        </Link>
      </div>
      <div className="flex-grow overflow-auto h-full flex flex-col gap-2">
        <MessagesList chat={chat} />
      </div>
      <div className="p-2 border-t">
        <Textarea placeholder="Type your message..." />
      </div>
    </div>
  );
}

export default function ChatPage() {
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const { chat, isLoading } = useChat(selectedChatId);
  if (!selectedChatId) {
    return <div className="p-4">No chat selected</div>;
  }
  if (!chat || isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  return <MessagesPage chat={chat} />;
}
