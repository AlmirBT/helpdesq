"use client";

import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useUiStore, NAV_ITEMS, type NavId } from "@/store/ui-store";
import { motion } from "framer-motion";
import {
  Home,
  Inbox,
  CheckSquare,
  Users,
  Shield,
  Tag,
  Clock,
  Settings,
  PanelLeftClose,
  Headphones,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";

const ICONS: Record<NavId, React.ComponentType<{ className?: string }>> = {
  home: Home,
  requests: Inbox,
  tasks: CheckSquare,
  users: Users,
  roles: Shield,
  tags: Tag,
  shifts: Clock,
  settings: Settings,
};

export function Sidebar({ className, onCloseMobile }: { className?: string; onCloseMobile?: () => void }) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const pathname = usePathname();
  const isMobile = typeof onCloseMobile === "function";

  return (
    <motion.aside
      initial={false}
      animate={{ width: isMobile ? 280 : collapsed ? 72 : 220 }}
      transition={transition.panel}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden border-r border-border/30 bg-card/40 backdrop-blur-xl",
        isMobile && "w-[280px]",
        className,
      )}
    >
      <div className="flex items-center border-b border-border/20 px-2 py-2.5 gap-2">
        {(!collapsed || isMobile) && (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Headphones className="h-4 w-4" />
            </span>
            <span className="truncate text-[13px] font-semibold text-foreground">
              HelpDesk
            </span>
          </div>
        )}
        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((x) => !x)}
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              collapsed && "mx-auto",
            )}
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            <PanelLeftClose
              className={cn(
                "h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                collapsed && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3" aria-label="Основное меню">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.id];
          const active =
            pathname === item.href ||
            (item.id !== "home" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13px] font-medium outline-none transition-all duration-200",
                "hover:bg-muted/50 hover:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground",
              )}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                  active ? "bg-accent/15 text-accent" : "bg-muted/40 text-muted-foreground group-hover:bg-muted/60 group-hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {(!collapsed || isMobile) && (
                <motion.span
                  initial={false}
                  animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -6 : 0 }}
                  transition={transition.fast}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/20 px-2 py-3">
        <ThemeSwitcher variant="sidebar" compact={collapsed} className="w-full" />
      </div>
    </motion.aside>
  );
}
