"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import AutoHeightTextarea, {
  AutoHeightTextareaProps,
} from "./auto-height-textarea";
import mergeRefs from "merge-refs";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Hashtag } from "@repo/types";

export function RichTextArea(props: AutoHeightTextareaProps) {
  const [isHashtaging, setIsHashtagging] = React.useState(false);
  const [hashtagSearch, setHashtagSearch] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

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
        const target = e.target as HTMLTextAreaElement;
        const cursorPos = target.selectionStart;
        detectHashtag(target.value, cursorPos);
      },
      { signal: abortController.signal },
    );
    textarea.addEventListener(
      "blur",
      () => {
        setIsHashtagging(false);
        setHashtagSearch("");
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
    return () => {
      abortController.abort();
    };
  }, []);

  const { isLoading, data } = useQuery({
    queryKey: ["hashtagSuggestions", hashtagSearch],
    queryFn: async () => {
      if (!hashtagSearch) return [];
      const res = await apiClient.get<Hashtag[]>("/hashtags/search", {
        params: { query: hashtagSearch },
      });
      return res.data;
    },
    enabled: isHashtaging && hashtagSearch.length > 0,
  });

  const HashTagSuggestions = useCallback(() => {
    if (isLoading) {
      return null;
    }
    if (!data) {
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
          {data.map((hashtag) => (
            <li
              key={hashtag.id}
              className="text-foreground p-2 hover:underline border-b border-border"
            >
              #{hashtag.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [data, isLoading, popupPosition]);

  return (
    <div className="relative">
      <AutoHeightTextarea {...props} ref={mergeRefs(props.ref, textareaRef)} />
      <div ref={mirrorRef} className="absolute top-0 invisible" />
      <HashTagSuggestions />
    </div>
  );
}
