"use client";
import { useEffect, useState } from "react";

export function useComposeMode() {
  const [mode, setMode] = useState<"post" | "poll">("post");

  useEffect(() => {
    const stored = localStorage.getItem("composeMode");
    if (stored === "poll") {
      setMode("poll");
    }
  }, []);

  return {
    mode,
    setMode: (newMode: "post" | "poll") => {
      localStorage.setItem("composeMode", newMode);
      setMode(newMode);
    },
  };
}
