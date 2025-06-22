"use client";
import { useEffect, useRef } from "react";

export function LoadMoreContent({
  isLoading,
  loadMore,
}: {
  isLoading: boolean;
  loadMore(): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
          console.log("Load more triggered");
          observer.disconnect();
        }
      },
      { threshold: 1 },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isLoading, loadMore]);

  return <div ref={ref} />;
}
