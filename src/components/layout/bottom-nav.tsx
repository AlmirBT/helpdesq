"use client";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import {
  Home,
  Inbox,
  CheckSquare,
  Bell,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "requests", label: "Обращения", href: "/dashboard/requests", icon: Inbox },
  { id: "tasks", label: "Задачи", href: "/dashboard/tasks", icon: CheckSquare },
  { id: "home", label: "Главная", href: "/dashboard", icon: Home },
  { id: "notifications", label: "Уведомления", href: "#", icon: Bell },
  { id: "menu", label: "Меню", icon: Menu },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border/30 bg-background/80 px-2 py-2 backdrop-blur-xl safe-area-pb md:hidden"
      aria-label="Мобильная навигация"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.id !== "menu" &&
          tab.id !== "notifications" &&
          (tab.id === "home" ? pathname === tab.href : pathname.startsWith(tab.href));
        const isMenu = tab.id === "menu";

        const content = (
          <span
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200",
              isActive && !isMenu && "bg-accent/10 text-accent",
              !isActive && !isMenu && "text-muted-foreground active:scale-95",
              isMenu && "text-muted-foreground active:scale-95",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium leading-tight">
              {tab.label}
            </span>
          </span>
        );

        if (isMenu) {
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Открыть меню"
            >
              {content}
            </button>
          );
        }

        if (tab.id === "notifications") {
          return (
            <button
              key={tab.id}
              type="button"
              className="touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Уведомления"
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href!}
            className="touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
