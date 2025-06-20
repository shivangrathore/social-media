import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePollDraft } from "../hooks/use-poll-draft";
import { useAutoSaveDraft } from "../hooks/use-auto-save-poll";
import { useMutation } from "@tanstack/react-query";
import { publishPoll } from "../api/polls";
import { PollLoadingSkeleton } from "./poll-loading-skeleton";

const ComposePollSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z
    .array(
      z.object({
        value: z.string().min(1, "Option cannot be empty"),
      }),
    )
    .min(2, "At least two options are required")
    .max(4, "A maximum of four options is allowed"),
});

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

export function PollComposeView() {
  const { draft, isLoading: isDraftLoading } = usePollDraft();
  const form = useForm({
    resolver: zodResolver(ComposePollSchema),
    defaultValues: {
      question: "",
      options: Array.from({ length: MIN_OPTIONS }, () => ({ value: "" })),
    },
  });

  const isDirty = form.formState.isDirty;

  const {
    append: addOption,
    remove: removeOption,
    fields: options,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (draft) {
      const options = [
        ...draft.options,
        ...Array.from({ length: MIN_OPTIONS - draft.options.length }, () => ""),
      ];
      form.reset({
        question: draft.question || "",
        options: options.map((option) => ({ value: option })),
      });
    }
  }, [draft]);

  const question = useWatch({ control: form.control, name: "question" });
  const optionsValues = useWatch({
    control: form.control,
    name: "options",
  });

  useAutoSaveDraft(isDirty, draft?.id, question, optionsValues);

  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationKey: ["publishPoll"],
    mutationFn: publishPoll,
    onSuccess: () => {
      console.log("Poll published successfully");
      form.reset({
        question: "",
        options: Array.from({ length: MIN_OPTIONS }, () => ({ value: "" })),
      });
    },
  });

  const handleSubmit = async () => {
    if (!draft?.id) return;
    await mutateAsync(draft.id);
  };

  const errorPublishing = (e: any) => {
    console.log(e);
  };

  const isValid = form.formState.isValid;

  if (isDraftLoading) {
    return <PollLoadingSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, errorPublishing)}>
        <Label className="mb-2 text-sm font-medium">Poll Question</Label>
        <Input
          {...form.register("question")}
          type="text"
          placeholder={"Ask a question..."}
        />
        <Label className="mt-4 mb-2 text-sm font-medium">Options</Label>
        <div className="gap-2 flex flex-col">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-1 justify-center"
            >
              <Input
                type="text"
                {...form.register(`options.${index}.value`)}
                placeholder={"Option " + (index + 1)}
              />
              {options.length > MIN_OPTIONS && (
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
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
          type="button"
          onClick={() => addOption({ value: "" })}
          disabled={options.length >= MAX_OPTIONS}
        >
          Add Option
        </Button>
        <Button
          className="mt-4 ml-auto block"
          type="submit"
          disabled={!isValid || isCreating}
        >
          Create Poll
        </Button>
      </form>
    </Form>
  );
}
