"use client";
import { cn, pluralize } from "@/lib/utils";
import { castVote } from "../api";
import { useCallback, useEffect, useState } from "react";
import { FeedPost } from "@repo/types";
import { RichContent } from "./rich-content";
import { usePollVoteStore } from "@/store/poll-votes-store";

type Poll = Extract<FeedPost, { postType: "poll" }>;

export function PollDisplay({ poll }: { poll: Poll }) {
  const setMyVote = usePollVoteStore((state) => state.setMyVote);
  const setPollVote = usePollVoteStore((state) => state.setPollVote);
  const setPollVotes = usePollVoteStore((state) => state.setPollVotes);
  const votes = usePollVoteStore((state) => state.pollVotes[poll.id]);
  const selectedOption = usePollVoteStore((state) => state.myVotes[poll.id]);
  const [isCasting, setIsCasting] = useState(false);

  useEffect(() => {
    if (!votes) {
      const initialVotes = poll.options.reduce(
        (acc, option) => {
          acc[option.id] = option.voteCount;
          return acc;
        },
        {} as Record<number, number>,
      );
      setPollVotes(poll.id, initialVotes);
    }
  }, [poll.id, poll.options, votes, setPollVotes]);

  useEffect(() => {
    if (!selectedOption) {
      const selected = poll.selectedOption;
      if (selected) {
        setMyVote(poll.id, selected);
      }
    }
  }, [selectedOption, poll.selectedOption, setMyVote]);

  const totalVotes = Object.values(votes ?? {}).reduce((a, b) => a + b, 0);

  const castVoteHandler = useCallback(
    async (optionId: number) => {
      if (selectedOption === optionId) return;
      setIsCasting(true);

      const previousOption = selectedOption;
      setMyVote(poll.id, optionId);
      if (selectedOption) {
        setPollVote(poll.id, selectedOption, (votes[selectedOption] ?? 0) - 1);
      }

      setPollVote(poll.id, optionId, (votes[optionId] ?? 0) + 1);

      try {
        await castVote(poll.id, optionId);
      } catch (e) {
        setMyVote(poll.id, previousOption ?? null);
        if (previousOption) {
          setPollVote(poll.id, previousOption, votes[previousOption] + 1);
        }
      } finally {
        setIsCasting(false);
      }
    },
    [poll.id, selectedOption, setMyVote, votes],
  );

  return (
    <div className="py-4">
      <RichContent content={poll.content || ""} className="mb-2 text-sm" />
      <p className="text-sm text-gray-500 mt-1">
        {pluralize(totalVotes, "vote")}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {poll.options.map((option) => {
          const optionVotes = votes?.[option.id] ?? 0;
          const width = totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;

          return (
            <li key={option.id}>
              <button
                disabled={isCasting}
                className={cn(
                  "flex justify-between w-full p-2 border border-border rounded-md cursor-pointer text-sm isolate relative overflow-hidden",
                  option.id === selectedOption
                    ? "border-primary"
                    : "hover:bg-primary/5",
                )}
                onClick={() => castVoteHandler(option.id)}
              >
                <span
                  className={cn(
                    "absolute inset-0 -z-10 transition-[width] duration-500",
                    {
                      "bg-gray-400/20": option.id !== selectedOption,
                      "bg-primary/20": option.id === selectedOption,
                    },
                  )}
                  style={{ width: `${width}%` }}
                />
                <span>{option.text}</span>
                <span>{optionVotes > 0 && pluralize(optionVotes, "vote")}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
