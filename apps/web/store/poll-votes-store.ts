import { create } from "zustand";

type PollVoteStore = {
  pollVotes: Record<number, Record<number, number>>;
  myVotes: Record<number, number>;
  setMyVote: (pollId: number, optionId: number) => void;
  setPollVotes: (pollId: number, votes: Record<number, number>) => void;
  setPollVote: (pollId: number, optionId: number, vote: number) => void;
  hydratePollVotes: (pollVotes: Record<string, Record<string, number>>) => void;
};

export const usePollVoteStore = create<PollVoteStore>((set) => ({
  pollVotes: {},
  myVotes: {},
  setMyVote: (pollId, optionId) =>
    set((state) => ({
      myVotes: {
        ...state.myVotes,
        [pollId]: optionId,
      },
    })),
  setPollVotes: (pollId, votes: Record<number, number>) =>
    set((state) => ({
      pollVotes: {
        ...state.pollVotes,
        [pollId]: votes,
      },
    })),

  setPollVote: (pollId, optionId, vote) =>
    set((state) => ({
      pollVotes: {
        ...state.pollVotes,
        [pollId]: {
          ...state.pollVotes[pollId],
          [optionId]: vote,
        },
      },
    })),
  hydratePollVotes: (pollVotes) =>
    set(() => ({
      pollVotes: Object.fromEntries(
        Object.entries(pollVotes).map(([pollId, options]) => [
          Number(pollId),
          Object.fromEntries(
            Object.entries(options).map(([optionId, vote]) => [
              Number(optionId),
              vote,
            ]),
          ),
        ]),
      ),
    })),
}));
