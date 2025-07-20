"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createChat } from "@/features/chat/api";
import { useChats } from "@/features/chat/hooks/use-chats";
import { useUserSearch } from "@/features/user/hooks/use-user-search";
import socket from "@/lib/socket";
import { cn, getInitials } from "@/lib/utils";
import { useUser } from "@/store/auth";
import { useChatStore } from "@/store/chat-store";
import { useMessagesStore } from "@/store/messages-store";
import { ChatMessage } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

function StartNewChat() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      setOpen(false);
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const shouldSearch = debouncedSearch.length > 0;
  const { users = [], isSearching } = useUserSearch(
    shouldSearch ? debouncedSearch : "",
    {
      searchWhenEmpty: false,
      ignoreMe: true,
    },
  );

  let content;
  if (search.trim() === "") {
    content = (
      <p className="text-sm text-muted-foreground">
        Type a name to search for users
      </p>
    );
  } else if (isSearching || search !== debouncedSearch) {
    content = <p className="text-sm text-muted-foreground">Searching...</p>;
  } else if (users.length === 0) {
    content = <p className="text-sm text-muted-foreground">No users found</p>;
  } else {
    content = (
      <ul className="">
        {users.map((user) => (
          <div
            key={user.id}
            className="mb-2 flex gap-4 items-center hover:bg-accent p-2 rounded-md cursor-pointer"
            onClick={() => mutateAsync(user.id)}
          >
            <Avatar>
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>
                {getInitials(user.name || user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm">{user.name}</span>
              <span className="text-sm text-muted-foreground">
                {user.username ? `@${user.username}` : ""}
              </span>
            </div>
          </div>
        ))}
      </ul>
    );
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full p-2 bg-primary text-white hover:bg-primary/90 transition-colors rounded-full cursor-pointer">
          Start New Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Start a new chat</DialogTitle>
        <Input
          type="text"
          placeholder="Search by name"
          className="w-full p-2 border border-border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {content}
      </DialogContent>
    </Dialog>
  );
}

function ChatList() {
  const { chats } = useChats();
  const { user: currentUser } = useUser();
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const setSelectedChatId = useChatStore((state) => state.setSelectedChatId);
  return (
    <div className="p-4 w-64 border-r border-border">
      <StartNewChat />
      <hr className="mt-4 mb-2" />
      <h2 className="text-sm font-medium text-muted-foreground mb-2">Chats</h2>
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat) => {
            const otherUser = chat.users!.find(
              (user) => user.id !== currentUser?.id,
            );
            if (!otherUser) return null;
            return (
              <li
                key={chat.id}
                className={cn(
                  "mb-2 flex gap-2 items-center hover:bg-accent p-2 rounded-md cursor-pointer",
                  selectedChatId == chat.id && "bg-accent",
                )}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <Avatar>
                  <AvatarImage src={otherUser.avatar || undefined} />
                  <AvatarFallback>
                    {getInitials(otherUser.name || otherUser.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm">{otherUser.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {otherUser.username ? `@${otherUser.username}` : ""}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No chats available</p>
      )}
    </div>
  );
}

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const addMessage = useMessagesStore((state) => state.addMessage);
  useEffect(() => {
    function onMessage(message: ChatMessage) {
      addMessage(message.chatId, message);
    }
    socket.on("message:new", onMessage);
    return () => {
      socket.off("message:new", onMessage);
    };
  }, []);
  return (
    <div className="flex w-[calc(100vw-var(--nav-width))] h-screen">
      <ChatList />
      <div className="flex-1 overflow-y-auto h-full">{children}</div>
    </div>
  );
}
