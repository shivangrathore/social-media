import { create } from "zustand";
import { Poll } from "@repo/api-types";
import { CreatePollDraftResponse } from "@repo/api-types/poll";
import { saveDraftPoll, createDraftPoll, publishPoll } from "../api/polls";

type PollStore = {
  poll: Poll;
  setPoll: (poll: Poll) => void;
  setQuestion: (question: string) => void;
  setOption: (index: number, value: string) => void;
  removeOption: (index: number) => void;
  addOption: () => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  clearDraft: () => void;
  isLoading: boolean;
  publishPoll: () => Promise<void>;
};

const defaultPoll: Poll = {
  id: 0,
  question: "",
  options: ["", ""],
  createdAt: new Date(),
  userId: 0,
};

function apiToPoll(data: CreatePollDraftResponse): Poll {
  const options = data.options;
  options.push(...new Array(2 - options.length).fill(""));
  return {
    id: data.id,
    question: data.question || "",
    options: data.options,
    createdAt: new Date(data.createdAt),
    userId: data.userId,
  };
}

export const pollStore = create<PollStore>((set) => ({
  poll: defaultPoll,
  addOption: () =>
    set((state) => ({
      poll: {
        ...state.poll,
        options: [...state.poll.options, ""],
      },
    })),
  setOption: (index: number, value: string) =>
    set((state) => ({
      poll: {
        ...state.poll,
        options: state.poll.options.map((option, i) =>
          i === index ? value : option,
        ),
      },
    })),
  setPoll: (poll) => set({ poll }),
  setQuestion: (question) =>
    set((state) => ({ poll: { ...state.poll, question } })),
  removeOption: (index) =>
    set((state) => ({
      poll: {
        ...state.poll,
        options: state.poll.options.filter((_, i) => i !== index),
      },
    })),
  isLoading: false,
  saveDraft: async () => {
    set({ isLoading: true });
    const poll = pollStore.getState().poll;
    await saveDraftPoll(poll);
    set({ isLoading: false });
  },
  loadDraft: async () => {
    set({ isLoading: true });
    const cloudDraft = await createDraftPoll();
    set({ poll: apiToPoll(cloudDraft), isLoading: false });
  },
  publishPoll: async () => {
    set({ isLoading: true });
    const postId = pollStore.getState().poll.id;
    await publishPoll(postId);
    pollStore.getState().clearDraft();
    set({ isLoading: false });
  },
  clearDraft: () => set({ poll: defaultPoll }),
}));

if (typeof window !== "undefined") {
  pollStore.getState().loadDraft();
}
