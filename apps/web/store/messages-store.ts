import { ChatMessage } from "@repo/types";
import { create } from "zustand";
import * as dateFns from "date-fns";

type MessagesStore = {
  messages: Record<number, ChatMessage[]>;
  addMessage: (chatId: number, message: ChatMessage) => void;
  clearMessages: (chatId: number) => void;
  hydrateMessages: (chatId: number, messages: ChatMessage[]) => void;
};

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  messages: {},

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  clearMessages: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...rest } = state.messages;
      return { messages: rest };
    }),

  hydrateMessages: (chatId, messages) => {
    let merged = [...(get().messages[chatId] || [])];
    const existingIds = new Set(merged.map((msg) => msg.id));
    for (const message of messages) {
      if (!existingIds.has(message.id)) {
        merged.push(message);
        existingIds.add(message.id);
      }
    }
    merged = merged.sort((a, b) =>
      dateFns.compareAsc(a.createdAt, b.createdAt),
    );

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: merged,
      },
    }));
  },
}));
