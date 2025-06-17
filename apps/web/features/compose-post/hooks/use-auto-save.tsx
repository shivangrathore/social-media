import { useEffect } from "react";
import { useStore } from "zustand";
import { postStore } from "../store/postStore";

export function useAutosave(content: string, delay: number = 1000) {
  const saveDraft = useStore(postStore, (state) => state.saveDraft);
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDraft();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, content]);
}
