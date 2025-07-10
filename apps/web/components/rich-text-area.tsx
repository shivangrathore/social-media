"use client";
import React, { useCallback, useEffect, useRef } from "react";
import AutoHeightTextarea, {
  AutoHeightTextareaProps,
} from "./auto-height-textarea";
import mergeRefs from "merge-refs";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Hashtag } from "@repo/types";
import { cn } from "@/lib/utils";

export function RichTextArea(props: AutoHeightTextareaProps) {
  const [isHashtaging, setIsHashtagging] = React.useState(false);
  const [hashtagSearch, setHashtagSearch] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<Map<number, HTMLLIElement>>(new Map());
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popupPosition, setPopupPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selectedHashtagIdx, setSelectedHashtagIdx] = React.useState<
    number | null
  >(null);
  const [hashtagSearchDebounced, setHashtagSearchDebounced] =
    React.useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setHashtagSearchDebounced(hashtagSearch);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [hashtagSearch]);
  const { isLoading, data } = useQuery({
    queryKey: ["hashtagSuggestions", hashtagSearchDebounced],
    queryFn: async () => {
      if (!hashtagSearch) return [];
      const res = await apiClient.get<Hashtag[]>("/hashtags/search", {
        params: { query: hashtagSearchDebounced },
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: isHashtaging && hashtagSearchDebounced.length > 0,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedHashtagIdx(0);
    } else {
      setSelectedHashtagIdx(null);
    }
  }, [data]);

  const getCursorPosition = useCallback(
    (textarea: HTMLTextAreaElement, cursorIndex: number) => {
      if (!mirrorRef.current) return { x: 0, y: 0 };
      const mirror = mirrorRef.current;
      mirror.innerHTML = "";
      const value = textarea.value;
      const leftText = value.slice(0, cursorIndex);
      const mirrorStyle = window.getComputedStyle(textareaRef.current!);
      mirror.style.fontSize = mirrorStyle.fontSize;
      mirror.style.fontFamily = mirrorStyle.fontFamily;
      mirror.style.fontWeight = mirrorStyle.fontWeight;
      mirror.style.lineHeight = mirrorStyle.lineHeight;
      mirror.style.letterSpacing = mirrorStyle.letterSpacing;
      mirror.style.whiteSpace = "pre-wrap";
      mirror.style.padding = mirrorStyle.padding;
      mirror.style.wordBreak = "break-word";
      mirror.style.width = `${textareaRef.current!.clientWidth}px`;
      if (leftText.length != -1) {
        const leftSpan = document.createElement("span");
        leftSpan.textContent = leftText;
        mirror.appendChild(leftSpan);
      }
      const cursorSpan = document.createElement("span");
      cursorSpan.textContent = "|";
      mirror.appendChild(cursorSpan);

      const cursorRect = cursorSpan.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();

      return {
        x: cursorRect.left - textareaRect.left,
        y: cursorRect.top - textareaRect.top,
      };
    },
    [],
  );
  function detectHashtag(value: string, cursorPos: number | null) {
    if (cursorPos === null) return;
    const cursor = getCursorPosition(textareaRef.current!, cursorPos);
    setPopupPosition(cursor);
    const leftText = value.slice(0, cursorPos);
    const match = leftText.match(/(?:^|\s)#([a-zA-Z0-9_]+)$/);
    if (match) {
      setIsHashtagging(true);
      setHashtagSearch(match[1]);
    } else {
      setIsHashtagging(false);
      setHashtagSearch("");
    }
  }

  useEffect(() => {
    if (suggestionsRef.current.size === 0 || selectedHashtagIdx === null) {
      return;
    }
    const selectedElement = suggestionsRef.current.get(selectedHashtagIdx);
    if (!selectedElement) return;
    selectedElement.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedHashtagIdx]);

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const abortController = new AbortController();
    textarea.addEventListener(
      "input",
      (e) => {
        const target = e.target as HTMLTextAreaElement;
        const cursorPos = target.selectionStart;
        detectHashtag(target.value, cursorPos);
      },
      { signal: abortController.signal },
    );
    textarea.addEventListener(
      "focus",
      (e) => {
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
        }
        const target = e.target as HTMLTextAreaElement;
        const cursorPos = target.selectionStart;
        detectHashtag(target.value, cursorPos);
      },
      { signal: abortController.signal },
    );
    textarea.addEventListener(
      "blur",
      () => {
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
        }
        blurTimeoutRef.current = setTimeout(() => {
          if (isHashtaging) {
            setIsHashtagging(false);
            setHashtagSearch("");
          }
        }, 150);
      },
      { signal: abortController.signal },
    );
    textarea.addEventListener(
      "click",
      (e) => {
        const target = e.target as HTMLTextAreaElement;
        const cursorPos = target.selectionStart;
        detectHashtag(target.value, cursorPos);
      },
      { signal: abortController.signal },
    );
    textarea.addEventListener(
      "keydown",
      (e) => {
        if (!isHashtaging) return;
        if (e.key === "ArrowDown") {
          if (!data || data.length === 0) return;
          e.preventDefault();
          setSelectedHashtagIdx((prev) => {
            prev = prev === null ? 0 : prev;
            return (prev + 1) % data.length;
          });
        } else if (e.key === "ArrowUp") {
          if (!data || data.length === 0) return;
          e.preventDefault();
          setSelectedHashtagIdx((prev) => {
            prev = prev === null ? data.length - 1 : prev;
            return (prev - 1 + data.length) % data.length;
          });
        } else if (e.key === "Enter") {
          if (!data || data.length === 0 || selectedHashtagIdx === null) return;
          e.preventDefault();
          const selectedHashtag = data[selectedHashtagIdx];
          insertHashtag(selectedHashtag.name);
        }
      },
      { signal: abortController.signal },
    );
    return () => {
      abortController.abort();
    };
  }, [isHashtaging, data, selectedHashtagIdx, getCursorPosition]);

  function insertHashtag(hashtag: string) {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const value = textarea.value;
    const leftText = value
      .slice(0, cursorPos)
      .slice(0, -hashtagSearch.length - 1);
    const rightText = value.slice(textarea.selectionEnd);
    const newValue = `${leftText}#${hashtag} ${rightText}`;
    textarea.value = newValue;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    setIsHashtagging(false);
    setHashtagSearch("");
  }

  const HashTagSuggestions = useCallback(() => {
    if (isLoading) {
      return null;
    }
    if (!data) {
      return null;
    }

    if (!data.length) {
      return null;
    }

    return (
      <div
        className="absolute h-60 -translate-x-1/2 bottom-2 w-80 bg-background rounded-md z-50 border border-border overflow-y-auto"
        style={{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y + 40}px`,
        }}
      >
        <ul>
          {data.map((hashtag, idx) => (
            <li
              ref={(node) => {
                if (node) {
                  suggestionsRef.current.set(idx, node);
                } else {
                  suggestionsRef.current.delete(idx);
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                insertHashtag(hashtag.name);
              }}
              key={hashtag.id}
              className={cn(
                "text-foreground p-2 hover:underline border-b border-border hover:bg-accent/70",
                idx == selectedHashtagIdx ? "bg-accent hover:bg-accent" : "",
              )}
            >
              #{hashtag.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [data, isLoading, popupPosition, selectedHashtagIdx]);

  return (
    <div className="relative">
      <AutoHeightTextarea {...props} ref={mergeRefs(props.ref, textareaRef)} />
      <div ref={mirrorRef} className="absolute top-0 invisible" />
      <HashTagSuggestions />
    </div>
  );
}
