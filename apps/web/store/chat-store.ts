import { create } from "zustand";

type ChatStore = {
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: null,
  setSelectedChatId: (id) => set({ selectedChatId: id }),
}));
