type FollowStore = {
  following: Record<string, boolean>;
  setFollowing: (username: string, isFollowing: boolean) => void;
};

import { create } from "zustand";

export const useFollowStore = create<FollowStore>((set) => ({
  following: {},
  setFollowing: (username, isFollowing) =>
    set((state) => ({
      following: {
        ...state.following,
        [username]: isFollowing,
      },
    })),
}));
