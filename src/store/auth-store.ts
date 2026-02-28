import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string, twoFactorCode: string) => boolean;
  logout: () => void;
  setUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username, _password, _twoFactorCode) => {
        set({
          isAuthenticated: true,
          user: {
            username,
            firstName: "Имя",
            lastName: "Фамилия",
            role: "Поддержка",
          },
        });
        return true;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      setUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),
    }),
    { name: "funtime-auth" },
  ),
);
