"use client";
import { cn, pluralize } from "@/lib/utils";
import { castVote } from "../api";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FeedPost, GetFeedResponse } from "@repo/types";
import { RichPostContent } from "./rich-post-content";

type Poll = Extract<FeedPost, { postType: "poll" }>;

export function PollDisplay({ poll }: { poll: Poll }) {
  const query = "feed";
  const selectedOption = poll.selectedOption;
  const options = poll.options;
  const totalVotes = options.reduce((acc, option) => acc + option.voteCount, 0);
  const queryClient = useQueryClient();
  const changeSelectedVote = useCallback(
    (optionId: number) => {
      queryClient.setQueryData([query], (old: GetFeedResponse) => {
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
                    return { ...option, voteCount: option.voteCount + 1 };
                  }
                  if (option.id === selectedOption) {
                    return { ...option, voteCount: option.voteCount - 1 };
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
      const oldData = queryClient.getQueryData<GetFeedResponse>([query]);
      changeSelectedVote(optionId);
      try {
        await castVote(poll.id, optionId);
      } catch (e) {
        queryClient.setQueryData([query], oldData);
      }
    },
    [poll.id, poll.selectedOption, poll.options, selectedOption],
  );

  return (
    <div className="py-4">
      <RichPostContent content={poll.content || ""} className="mb-2 text-sm" />
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
                      : `${(option.voteCount / totalVotes) * 100}%`,
                }}
              />
              <span>{option.text}</span>
              <span>
                {option.voteCount > 0 && pluralize(option.voteCount, "vote")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
