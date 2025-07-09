"use client";
import { create, useStore } from "zustand";
import { apiClient } from "@/lib/apiClient";
import { useShallow } from "zustand/shallow";
import { IUser } from "@repo/types";

type AuthStore = {
  user: IUser | null;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: IUser) => void;
  clearUser: () => void;
};

export const authStore = create<AuthStore>((set) => {
  return {
    user: null,
    isLoading: true,
    setUser: (user: IUser) => set({ user, isLoading: false }),
    clearUser: () => set({ user: null, isLoading: false }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
  };
});

export async function loadUser() {
  const state = authStore.getState();
  try {
    state.setLoading(true);
    const res = await apiClient.get<IUser>("/users/@me");
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
