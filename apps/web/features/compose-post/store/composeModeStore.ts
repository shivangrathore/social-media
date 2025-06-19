import { create } from "zustand";

type ComposeModeStore = {
  mode: "post" | "poll";
  setMode: (mode: "post" | "poll") => void;
};

export const composeModeStore = create<ComposeModeStore>((set) => ({
  mode: "post",
  setMode: (mode) => {
    localStorage.setItem("composeMode", mode);
    set({ mode });
  },
}));

if (typeof window !== "undefined") {
  const composeMode = localStorage.getItem("composeMode");
  if (composeMode === "poll" || composeMode === "post") {
    composeModeStore.setState({ mode: composeMode });
  } else {
    localStorage.setItem("composeMode", "post");
  }
}
