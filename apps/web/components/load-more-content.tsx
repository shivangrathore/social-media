"use client";
import { useEffect, useRef, useState } from "react";

export function LoadMoreContent({
  isLoading,
  loadMore,
}: {
  isLoading: boolean;
  loadMore(): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (isIntersecting && !isLoading) {
      loadMore();
    }
  }, [isIntersecting, loadMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 1 },
    );

    const node = ref.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [isLoading, setIsIntersecting]);

  return <div ref={ref} />;
}
