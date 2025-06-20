"use client";
import { cn } from "@/lib/utils";
import { FeedEntry } from "@repo/api-types/feed";
import { castVote } from "../api";
import { useCallback, useState } from "react";

type Poll = Extract<FeedEntry, { postType: "poll" }>;

export function PollDisplay({ poll }: { poll: Poll }) {
  const [selectedOption, setSelectedOption] = useState(poll.selectedOption);
  const [options, setOptions] = useState(poll.options);
  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);
  const castVoteHandler = useCallback(
    async (optionId: number) => {
      if (selectedOption === optionId) {
        return;
      }
      setOptions((prevOptions) =>
        prevOptions.map((option) => {
          if (selectedOption === option.id) {
            return { ...option, votes: option.votes - 1 };
          }
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        }),
      );
      setSelectedOption(optionId);
      try {
        await castVote(poll.id, optionId);
      } catch (e) {
        setOptions(poll.options);
        setSelectedOption(poll.selectedOption);
      }
    },
    [poll.id, poll.selectedOption, poll.options, selectedOption],
  );

  return (
    <div className="p-4">
      <h3 className="font-semibold">{poll.question}</h3>
      <p className="text-sm text-gray-500 mt-1">{totalVotes} votes</p>
      <ul className="mt-2 flex flex-col gap-2">
        {options.map((option) => (
          <li key={option.id}>
            <button
              className={cn(
                "flex justify-between w-full p-2 border border-border rounded-md cursor-pointer text-sm isolate relative overflow-hidden",
                option.id == selectedOption
                  ? "border-primary"
                  : "hover:bg-primary/5",
              )}
              onClick={() => castVoteHandler(option.id)}
            >
              <span
                className={cn("absolute inset-0 -z-10", {
                  "bg-gray-400/20": option.id != selectedOption,
                  "bg-primary/20": option.id == selectedOption,
                })}
                style={{
                  width:
                    totalVotes == 0
                      ? 0
                      : `${(option.votes / totalVotes) * 100}%`,
                }}
              />
              <span>{option.option}</span>
              <span>{option.votes} votes</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
