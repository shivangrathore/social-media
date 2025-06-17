import React, { useCallback, useEffect } from "react";

type AutoHeightTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    minRows?: number;
    maxRows?: number;
  };

// TODO: use the minRows and maxRows props to adjust the height of the textarea
const AutoHeightTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoHeightTextareaProps
>(({ minRows, maxRows, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null!);
  const multipleRefs = (el: HTMLTextAreaElement) => {
    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
    textareaRef.current = el;
  };
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
  return <textarea {...props} ref={multipleRefs} onInput={handleInput} />;
});

AutoHeightTextarea.displayName = "AutoHeightTextarea";
export default AutoHeightTextarea;
