import React, { ComponentProps, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import mergeRefs from "merge-refs";

export type AutoHeightTextareaProps = ComponentProps<"textarea"> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    minRows?: number;
    maxRows?: number;
  };

// TODO: use the minRows and maxRows props to adjust the height of the textarea
const AutoHeightTextarea = ({ ref, ...props }: AutoHeightTextareaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null!);
  const adjustHeight = useCallback(() => {
    const target = textareaRef.current;
    if (target) {
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  const handleInput = () => {
    adjustHeight();
  };
  return (
    <Textarea
      {...props}
      ref={mergeRefs(ref, textareaRef)}
      onInput={handleInput}
    />
  );
};

AutoHeightTextarea.displayName = "AutoHeightTextarea";
export default AutoHeightTextarea;
