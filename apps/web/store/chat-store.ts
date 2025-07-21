import { Chat } from "@repo/types";
import { create } from "zustand";
import * as dateFns from "date-fns";

type ChatStore = {
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
  chats: Chat[];
  hydrateChats: (chats: Chat[]) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  selectedChatId: null,
  setSelectedChatId: (id) => set({ selectedChatId: id }),
  hydrateChats: (chats) => {
    const existingChats = get().chats;
    const existingChatIds = new Set(existingChats.map((chat) => chat.id));
    const newChats = chats.filter((chat) => !existingChatIds.has(chat.id));
    const finalChats = [...existingChats, ...newChats].sort((chatA, chatB) => {
      return dateFns.compareAsc(chatA.createdAt, chatB.createdAt);
    });
    set({ chats: finalChats });
  },
}));
