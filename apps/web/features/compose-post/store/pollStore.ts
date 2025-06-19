import { create } from "zustand";
import { Poll } from "@repo/api-types";

type PollStore = {
  poll: Poll;
  setPoll: (poll: Poll) => void;
  setQuestion: (question: string) => void;
  setOptions: (options: string[]) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  clearDraft: () => void;
  isLoading: boolean;
};

const defaultPoll: Poll = {
  id: 0,
  question: "",
  options: [],
  createdAt: new Date(),
  userId: 0,
};

export const pollStore = create<PollStore>((set) => ({
  poll: defaultPoll,
  setPoll: (poll) => set({ poll }),
  setQuestion: (question) =>
    set((state) => ({ poll: { ...state.poll, question } })),
  setOptions: (options) =>
    set((state) => ({ poll: { ...state.poll, options } })),
  isLoading: false,
  saveDraft: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
  loadDraft: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ poll: defaultPoll, isLoading: false });
  },
  clearDraft: () => set({ poll: defaultPoll }),
}));
