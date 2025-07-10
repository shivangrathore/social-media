"use client";
import { create, useStore } from "zustand";
import { apiClient } from "@/lib/apiClient";
import { useShallow } from "zustand/shallow";
import { User } from "@repo/types";

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const authStore = create<AuthStore>((set) => {
  return {
    user: null,
    isLoading: true,
    setUser: (user: User) => set({ user, isLoading: false }),
    clearUser: () => set({ user: null, isLoading: false }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
  };
});

export async function loadUser() {
  const state = authStore.getState();
  try {
    state.setLoading(true);
    const res = await apiClient.get<User>("/users/@me");
    state.setUser(res.data);
  } catch (e) {
    state.clearUser();
  }
}

export const useUser = () => {
  const { user, isLoading } = useStore(
    authStore,
    useShallow(({ user, isLoading }) => ({
      user,
      isLoading,
    })),
  );
  return { user, isLoading };
};
