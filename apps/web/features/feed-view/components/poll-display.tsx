"use client";
import { cn, pluralize } from "@/lib/utils";
import { FeedEntry, FeedResponse } from "@repo/api-types/feed";
import { castVote } from "../api";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

type Poll = Extract<FeedEntry, { postType: "poll" }>;

export function PollDisplay({ poll }: { poll: Poll }) {
  const selectedOption = poll.selectedOption;
  const options = poll.options;
  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);
  const queryClient = useQueryClient();
  const changeSelectedVote = useCallback(
    (optionId: number) => {
      queryClient.setQueryData(["feed"], (old: FeedResponse) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((entry) => {
            if (entry.id === poll.id && entry.postType === "poll") {
              return {
                ...entry,
                selectedOption: optionId,
                options: entry.options.map((option) => {
                  if (option.id === optionId) {
                    return { ...option, votes: option.votes + 1 };
                  }
                  if (option.id === selectedOption) {
                    return { ...option, votes: option.votes - 1 };
                  }
                  return option;
                }),
              };
            }
            return entry;
          }),
        };
      });
    },
    [queryClient, poll.id, selectedOption],
  );
  const castVoteHandler = useCallback(
    async (optionId: number) => {
      if (selectedOption === optionId) {
        return;
      }
      const oldData = queryClient.getQueryData<FeedResponse>(["feed"]);
      changeSelectedVote(optionId);
      try {
        await castVote(poll.id, optionId);
      } catch (e) {
        queryClient.setQueryData(["feed"], oldData);
      }
    },
    [poll.id, poll.selectedOption, poll.options, selectedOption],
  );

  return (
    <div className="p-4">
      <h3 className="font-semibold">{poll.question}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {pluralize(totalVotes, "vote")}
      </p>
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
                className={cn(
                  "absolute inset-0 -z-10 transition-[width] duration-500",
                  {
                    "bg-gray-400/20": option.id != selectedOption,
                    "bg-primary/20": option.id == selectedOption,
                  },
                )}
                style={{
                  width:
                    totalVotes == 0
                      ? 0
                      : `${(option.votes / totalVotes) * 100}%`,
                }}
              />
              <span>{option.option}</span>
              <span>{option.votes > 0 && pluralize(option.votes, "vote")}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
