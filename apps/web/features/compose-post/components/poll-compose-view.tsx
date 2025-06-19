import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { pollStore } from "../store/pollStore";
import PostToolbar from "./post-toolbar";

const RANDOM_QUESTIONS = [
  {
    question: "What is your favorite book?",
    options: ["Harry Potter", "Lord of the Rings"],
  },
  {
    question: "What is your favorite movie?",
    options: ["Inception", "The Matrix"],
  },
  {
    question: "What is your favorite food?",
    options: ["Pizza", "Sushi"],
  },
  {
    question: "What is your favorite hobby?",
    options: ["Reading", "Gaming"],
  },
  {
    question: "What is your favorite sport?",
    options: ["Football", "Basketball"],
  },
];

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

export function PollComposeView() {
  const placeholder = useMemo(
    () => RANDOM_QUESTIONS[Math.floor(Math.random() * RANDOM_QUESTIONS.length)],
    [],
  );
  const options = useStore(pollStore, (state) => state.poll.options);
  const addOption = useStore(pollStore, (state) => state.addOption);
  const question = useStore(pollStore, (state) => state.poll.question);
  const setQuestion = useStore(pollStore, (state) => state.setQuestion);
  const removeOption = useStore(pollStore, (state) => state.removeOption);
  const setOption = useStore(pollStore, (state) => state.setOption);
  const saveDraft = useStore(pollStore, (state) => state.saveDraft);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDraft();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [options, question, saveDraft]);
  return (
    <div>
      <div>
        <Label className="mb-2 text-sm font-medium">Poll Question</Label>
        <Input
          type="text"
          placeholder={placeholder.question}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Label className="mt-4 mb-2 text-sm font-medium">Options</Label>
        <div className="gap-2 flex flex-col">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-1 justify-center">
              <Input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  setOption(index, e.target.value);
                }}
                placeholder={
                  placeholder.options[index] || "Option " + (index + 1)
                }
              />
              {options.length > MIN_OPTIONS && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeOption(index);
                  }}
                >
                  <XIcon className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          className="mt-2"
          variant="outline"
          onClick={() => addOption()}
          disabled={options.length >= MAX_OPTIONS}
        >
          Add Option
        </Button>
      </div>
      <PostToolbar mode="poll" />
    </div>
  );
}
