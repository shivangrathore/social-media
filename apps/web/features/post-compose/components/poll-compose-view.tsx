import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePollDraft } from "../hooks/use-poll-draft";
import { useAutoSaveDraftPoll } from "../hooks/use-auto-save-poll";
import { useMutation } from "@tanstack/react-query";
import { publishPost } from "../api/posts";
import { PollLoadingSkeleton } from "./poll-loading-skeleton";
import { useAutosavePost } from "../hooks/use-auto-save-post";

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
  const { draft, isLoading: isDraftLoading, create } = usePollDraft();
  const form = useForm({
    resolver: zodResolver(ComposePollSchema),
    defaultValues: {
      question: "",
      options: Array.from({ length: MIN_OPTIONS }, () => ({ value: "" })),
    },
  });
  //
  const isDirty = form.formState.isDirty;
  const question = useWatch({ control: form.control, name: "question" });
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
        question: draft.content || "",
        options: options.map((option) => ({ value: option })),
      });
    }
  }, [draft]);

  const optionsValues = useWatch({
    control: form.control,
    name: "options",
  });

  const { forceSave } = useAutosavePost(isDirty, draft?.id, question, create);
  const { save: forceSaveOptions } = useAutoSaveDraftPoll(
    isDirty,
    draft?.id,
    optionsValues,
  );

  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationKey: ["publishPoll"],
    mutationFn: async () => {
      if (!draft?.id) throw new Error("Draft ID is required to publish");
      return publishPost(draft.id);
    },
    onSuccess: () => {
      form.reset({
        question: "",
        options: Array.from({ length: MIN_OPTIONS }, () => ({ value: "" })),
      });
    },
  });

  const onSubmit = async () => {
    if (!draft?.id) return;
    await forceSave({ id: draft.id, content: question });
    await forceSaveOptions({ postId: draft.id, optionsValues });
    await mutateAsync();
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
      <form onSubmit={form.handleSubmit(onSubmit, errorPublishing)}>
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
