import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NavId =
  | "home"
  | "requests"
  | "tasks"
  | "users"
  | "roles"
  | "tags"
  | "shifts"
  | "settings";

export const NAV_ITEMS: { id: NavId; label: string; href: string }[] = [
  { id: "home", label: "Главная", href: "/dashboard" },
  { id: "requests", label: "Обращения", href: "/dashboard/requests" },
  { id: "tasks", label: "Задачи", href: "/dashboard/tasks" },
  { id: "users", label: "Пользователи", href: "/dashboard/users" },
  { id: "roles", label: "Роли", href: "/dashboard/roles" },
  { id: "tags", label: "Теги", href: "/dashboard/tags" },
  { id: "shifts", label: "Смены", href: "/dashboard/shifts" },
  { id: "settings", label: "Настройки", href: "/dashboard/settings" },
];

interface UiState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  activeNav: NavId;
  setActiveNav: (id: NavId) => void;
  focusMode: boolean;
  setFocusMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  contextPanelOpen: boolean;
  setContextPanelOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  todayRequestCount: number;
  setTodayRequestCount: (value: number | ((prev: number) => number)) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (value: boolean) => void;
  beginnerMode: boolean;
  setBeginnerMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileRequestsView: "list" | "chat";
  setMobileRequestsView: (value: "list" | "chat") => void;
  mobileContextSheetOpen: boolean;
  setMobileContextSheetOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (value) =>
        set((state) => ({
          sidebarCollapsed:
            typeof value === "function" ? value(state.sidebarCollapsed) : value,
        })),
      activeNav: "home",
      setActiveNav: (id) => set({ activeNav: id }),
      focusMode: false,
      setFocusMode: (value) =>
        set((state) => ({
          focusMode:
            typeof value === "function" ? value(state.focusMode) : value,
        })),
      contextPanelOpen: true,
      setContextPanelOpen: (value) =>
        set((state) => ({
          contextPanelOpen:
            typeof value === "function" ? value(state.contextPanelOpen) : value,
        })),
      todayRequestCount: 0,
      setTodayRequestCount: (value) =>
        set((state) => ({
          todayRequestCount:
            typeof value === "function" ? value(state.todayRequestCount) : value,
        })),
      onboardingCompleted: false,
      setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
      beginnerMode: false,
      setBeginnerMode: (value) =>
        set((state) => ({
          beginnerMode:
            typeof value === "function" ? value(state.beginnerMode) : value,
        })),
      aiPanelOpen: false,
      setAiPanelOpen: (value) =>
        set((state) => ({
          aiPanelOpen:
            typeof value === "function" ? value(state.aiPanelOpen) : value,
        })),
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (value) =>
        set((state) => ({
          mobileSidebarOpen:
            typeof value === "function" ? value(state.mobileSidebarOpen) : value,
        })),
      mobileRequestsView: "list",
      setMobileRequestsView: (value) => set({ mobileRequestsView: value }),
      mobileContextSheetOpen: false,
      setMobileContextSheetOpen: (value) =>
        set((state) => ({
          mobileContextSheetOpen:
            typeof value === "function" ? value(state.mobileContextSheetOpen) : value,
        })),
    }),
    {
      name: "funtime-ui",
      partialize: (s) => ({
        onboardingCompleted: s.onboardingCompleted,
        beginnerMode: s.beginnerMode,
      }),
    },
  ),
);

