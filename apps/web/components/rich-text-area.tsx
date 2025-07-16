"use client";
import React, { useCallback, useEffect, useRef } from "react";
import AutoHeightTextarea, {
  AutoHeightTextareaProps,
} from "./auto-height-textarea";
import mergeRefs from "merge-refs";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Hashtag, User } from "@repo/types";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { UserProfile } from "./user-profile";

export function RichTextArea(props: AutoHeightTextareaProps) {
  const [isHashtaging, setIsHashtagging] = React.useState(false);
  const [isMentioning, setIsMentioning] = React.useState(false);

  const [hashtagSearch, setHashtagSearch] = React.useState("");
  const [mentionSearch, setMentionSearch] = React.useState("");

  const [hashtagSearchDebounced, setHashtagSearchDebounced] =
    React.useState("");
  const [mentionSearchDebounced, setMentionSearchDebounced] =
    React.useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 });
  const [selectedHashtagIdx, setSelectedHashtagIdx] = React.useState<
    number | null
  >(null);
  const [selectedMentionIdx, setSelectedMentionIdx] = React.useState<
    number | null
  >(null);

  useEffect(() => {
    const t = setTimeout(() => setHashtagSearchDebounced(hashtagSearch), 300);
    return () => clearTimeout(t);
  }, [hashtagSearch]);

  useEffect(() => {
    const t = setTimeout(() => setMentionSearchDebounced(mentionSearch), 300);
    return () => clearTimeout(t);
  }, [mentionSearch]);

  const { isLoading: isHashtagLoading, data: hashtagData } = useQuery({
    queryKey: ["hashtagSuggestions", hashtagSearchDebounced],
    queryFn: async () => {
      if (!hashtagSearchDebounced) return [];
      const res = await apiClient.get<Hashtag[]>("/hashtags/search", {
        params: { query: hashtagSearchDebounced },
      });
      return res.data;
    },
    enabled: isHashtaging && hashtagSearchDebounced.length > 0,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isMentionLoading, data: mentionData } = useQuery({
    queryKey: ["mentionSuggestions", mentionSearchDebounced],
    queryFn: async () => {
      if (!mentionSearchDebounced) return [];
      const res = await apiClient.get<User[]>("/users/search", {
        params: { query: mentionSearchDebounced },
      });
      return res.data;
    },
    enabled: isMentioning && mentionSearchDebounced.length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (hashtagData?.length) setSelectedHashtagIdx(0);
    else setSelectedHashtagIdx(null);
  }, [hashtagData]);

  useEffect(() => {
    if (mentionData?.length) setSelectedMentionIdx(0);
    else setSelectedMentionIdx(null);
  }, [mentionData]);

  const getCursorPosition = useCallback(
    (textarea: HTMLTextAreaElement, cursorIndex: number) => {
      if (!mirrorRef.current) return { x: 0, y: 0 };
      const mirror = mirrorRef.current;
      const value = textarea.value;
      const leftText = value.slice(0, cursorIndex);
      const style = window.getComputedStyle(textarea);

      mirror.innerHTML = "";
      Object.assign(mirror.style, {
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        whiteSpace: "pre-wrap",
        padding: style.padding,
        wordBreak: "break-word",
        width: `${textarea.clientWidth}px`,
      });

      const leftSpan = document.createElement("span");
      leftSpan.textContent = leftText;
      mirror.appendChild(leftSpan);

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

  function detectTrigger(value: string, cursorPos: number | null) {
    if (cursorPos === null) return;
    const cursor = getCursorPosition(textareaRef.current!, cursorPos);
    setPopupPosition(cursor);
    const leftText = value.slice(0, cursorPos);

    const hashtagMatch = leftText.match(/(?:^|\s)#([a-zA-Z0-9_]+)$/);
    const mentionMatch = leftText.match(/(?:^|\s)@([a-zA-Z0-9_]+)$/);

    if (hashtagMatch) {
      setIsHashtagging(true);
      setHashtagSearch(hashtagMatch[1]);
      setIsMentioning(false);
      setMentionSearch("");
    } else if (mentionMatch) {
      setIsMentioning(true);
      setMentionSearch(mentionMatch[1]);
      setIsHashtagging(false);
      setHashtagSearch("");
    } else {
      setIsHashtagging(false);
      setIsMentioning(false);
      setHashtagSearch("");
      setMentionSearch("");
    }
  }

  function insertHashtag(hashtag: string) {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const value = textareaRef.current.value;
    const leftText = value
      .slice(0, cursorPos)
      .slice(0, -hashtagSearch.length - 1);
    const rightText = value.slice(textareaRef.current.selectionEnd);
    textareaRef.current.value = `${leftText}#${hashtag} ${rightText}`;
    textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    setIsHashtagging(false);
    setHashtagSearch("");
  }

  function insertMention(username: string) {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const value = textareaRef.current.value;
    const leftText = value
      .slice(0, cursorPos)
      .slice(0, -mentionSearch.length - 1);
    const rightText = value.slice(textareaRef.current.selectionEnd);
    textareaRef.current.value = `${leftText}@${username} ${rightText}`;
    textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    setIsMentioning(false);
    setMentionSearch("");
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const abort = new AbortController();

    textarea.addEventListener(
      "input",
      (e) => {
        const cursorPos = (e.target as HTMLTextAreaElement).selectionStart;
        detectTrigger((e.target as HTMLTextAreaElement).value, cursorPos);
      },
      { signal: abort.signal },
    );

    textarea.addEventListener(
      "focus",
      (e) => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        detectTrigger(
          (e.target as HTMLTextAreaElement).value,
          (e.target as HTMLTextAreaElement).selectionStart,
        );
      },
      { signal: abort.signal },
    );

    textarea.addEventListener(
      "click",
      (e) => {
        detectTrigger(
          (e.target as HTMLTextAreaElement).value,
          (e.target as HTMLTextAreaElement).selectionStart,
        );
      },
      { signal: abort.signal },
    );

    textarea.addEventListener(
      "blur",
      () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = setTimeout(() => {
          setIsHashtagging(false);
          setIsMentioning(false);
          setHashtagSearch("");
          setMentionSearch("");
        }, 150);
      },
      { signal: abort.signal },
    );

    textarea.addEventListener(
      "keydown",
      (e) => {
        if (isHashtaging && hashtagData?.length) {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedHashtagIdx((prev) =>
              prev === null ? 0 : (prev + 1) % hashtagData.length,
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedHashtagIdx((prev) =>
              prev === null
                ? hashtagData.length - 1
                : (prev - 1 + hashtagData.length) % hashtagData.length,
            );
          } else if (e.key === "Enter" && selectedHashtagIdx !== null) {
            e.preventDefault();
            insertHashtag(hashtagData[selectedHashtagIdx].name);
          }
        } else if (isMentioning && mentionData?.length) {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedMentionIdx((prev) =>
              prev === null ? 0 : (prev + 1) % mentionData.length,
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedMentionIdx((prev) =>
              prev === null
                ? mentionData.length - 1
                : (prev - 1 + mentionData.length) % mentionData.length,
            );
          } else if (e.key === "Enter" && selectedMentionIdx !== null) {
            e.preventDefault();
            insertMention(mentionData[selectedMentionIdx].username);
          }
        }
      },
      { signal: abort.signal },
    );

    return () => abort.abort();
  }, [
    isHashtaging,
    isMentioning,
    hashtagData,
    mentionData,
    selectedHashtagIdx,
    selectedMentionIdx,
  ]);

  const HashTagSuggestions = useCallback(() => {
    if (!isHashtaging || !hashtagData?.length || isHashtagLoading) return null;
    return (
      <div
        className="absolute h-60 -translate-x-1/2 bottom-2 w-80 bg-background rounded-md z-50 border border-border overflow-y-auto"
        style={{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y + 40}px`,
        }}
      >
        <ul>
          {hashtagData.map((hashtag, idx) => (
            <li
              key={hashtag.id}
              onClick={(e) => {
                e.preventDefault();
                insertHashtag(hashtag.name);
              }}
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
  }, [isHashtaging, hashtagData, selectedHashtagIdx, popupPosition]);

  const MentionSuggestions = useCallback(() => {
    if (!isMentioning || !mentionData?.length || isMentionLoading) return null;
    return (
      <div
        className="absolute h-60 -translate-x-1/2 bottom-2 w-80 bg-background rounded-md z-50 border border-border overflow-y-auto"
        style={{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y + 40}px`,
        }}
      >
        <ul>
          {mentionData.map((user, idx) => (
            <li
              key={user.id}
              onClick={(e) => {
                e.preventDefault();
                insertMention(user.username);
              }}
              className={cn(
                "text-foreground p-2 border-b border-border hover:bg-accent/70 flex items-center gap-2 cursor-pointer",
                idx == selectedMentionIdx ? "bg-accent hover:bg-accent" : "",
              )}
            >
              <UserProfile user={user} className="pointer-events-none" />
            </li>
          ))}
        </ul>
      </div>
    );
  }, [isMentioning, mentionData, selectedMentionIdx, popupPosition]);

  return (
    <div className="relative">
      <AutoHeightTextarea {...props} ref={mergeRefs(props.ref, textareaRef)} />
      <div ref={mirrorRef} className="absolute top-0 invisible" />
      <HashTagSuggestions />
      <MentionSuggestions />
    </div>
  );
}
