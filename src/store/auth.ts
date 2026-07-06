import { create } from "zustand";
import { authService } from "@/src/clients/container";
import { CurrentUser } from "../core/domain/user";

interface UserStore {
  user: CurrentUser | null;
  loading: boolean;

  setUser: (user: CurrentUser | null) => void;
  getUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  getUser: async () => {
    if (get().loading) return;

    try {
      set({ loading: true });

      const data = await authService.me();

      set({
        user: data,
      });
    } catch (error) {
      console.error(error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      set({ user: null });
    }
  },
}));
