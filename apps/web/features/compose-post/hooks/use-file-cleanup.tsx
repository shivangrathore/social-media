import React, { useCallback } from "react";

export function useFileCleanup() {
  const urlsRef = React.useRef<Set<string>>(new Set());

  const addUrl = useCallback((url: string) => {
    urlsRef.current.add(url);
  }, []);

  const removeUrl = useCallback((url: string) => {
    if (!urlsRef.current.has(url)) return;
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  }, []);

  return { addUrl, removeUrl };
}
