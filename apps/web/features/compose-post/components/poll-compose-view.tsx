import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import React, { useCallback } from "react";

const RANDOM_QUESTIONS = [
  {
    question: "What is your favorite book?",
    options: ["Harry Potter", "Lord of the Rings"],
  },
  {
    question: "What is your favorite movie?",
    options: ["Inception", "The Matrix", "Interstellar"],
  },
  {
    question: "What is your favorite food?",
    options: ["Pizza", "Sushi", "Burger", "Pasta"],
  },
  {
    question: "What is your favorite hobby?",
    options: ["Reading", "Gaming", "Traveling"],
  },
  {
    question: "What is your favorite sport?",
    options: ["Football", "Basketball", "Tennis"],
  },
];

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

export function PollComposeView() {
  const randomPlaceholderQuestion =
    RANDOM_QUESTIONS[Math.floor(Math.random() * RANDOM_QUESTIONS.length)];
  const [options, setOptions] = React.useState<string[]>(["", ""]);
  const addOption = useCallback(
    (option: string) => {
      if (options.length >= 4) return;
      setOptions((prev) => [...prev, option]);
    },
    [options.length],
  );
  return (
    <div>
      <Label className="mb-2 text-sm font-medium">Poll Question</Label>
      <Input type="text" placeholder={randomPlaceholderQuestion.question} />
      <Label className="mt-4 mb-2 text-sm font-medium">Options</Label>
      <div className="gap-2 flex flex-col">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-1 justify-center">
            <Input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={randomPlaceholderQuestion.options[index]}
            />
            {options.length > MIN_OPTIONS && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setOptions((prev) => prev.filter((_, i) => i !== index));
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
        onClick={() => addOption("")}
        disabled={options.length >= MAX_OPTIONS}
      >
        Add Option
      </Button>
    </div>
  );
}
