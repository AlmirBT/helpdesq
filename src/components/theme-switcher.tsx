"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ThemeSwitcher({
  className,
  compact,
  variant = "default",
}: {
  className?: string;
  compact?: boolean;
  variant?: "default" | "sidebar";
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isLight = theme === "light";
  const isSidebar = variant === "sidebar";

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex rounded-xl bg-muted/20 p-0.5",
          isSidebar && "rounded-xl border-0 bg-muted/30",
          compact ? "flex-col gap-1" : "gap-0.5",
          className,
        )}
      >
        <span className={cn("rounded-lg bg-muted/40", compact ? "h-9 w-full" : "h-8 w-16")} />
      </div>
    );
  }

  if (isSidebar) {
    return (
      <div
        className={cn(
          "flex flex-col gap-1.5 rounded-xl",
          compact ? "" : "gap-1",
          className,
        )}
        role="group"
        aria-label="Переключение темы"
      >
        {!compact && (
          <span className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Тема
          </span>
        )}
        <div
          className={cn(
            "relative flex rounded-xl bg-muted/40 p-1",
            compact ? "flex-col gap-1" : "flex-row gap-1",
          )}
        >
          {!compact && (
            <motion.span
              layoutId="theme-switcher-sidebar-pill"
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className={cn(
                "absolute rounded-lg bg-background shadow-subtle ring-1 ring-border/30",
                isLight ? "left-1 right-1/2 top-1 bottom-1" : "left-1/2 right-1 top-1 bottom-1",
              )}
            />
          )}
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 rounded-lg py-2 transition-colors duration-200",
              compact ? "h-10 w-full" : "min-h-[36px] flex-1",
              isLight
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              compact && isLight && "bg-background shadow-subtle",
            )}
            title="Светлая тема"
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                isLight ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-muted/50",
              )}
            >
              <Sun className="h-4 w-4" />
            </span>
            {!compact && <span className="text-[12px] font-medium">Светлая</span>}
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 rounded-lg py-2 transition-colors duration-200",
              compact ? "h-10 w-full" : "min-h-[36px] flex-1",
              !isLight
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              compact && !isLight && "bg-background shadow-subtle",
            )}
            title="Тёмная тема"
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                !isLight ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "bg-muted/50",
              )}
            >
              <Moon className="h-4 w-4" />
            </span>
            {!compact && <span className="text-[12px] font-medium">Тёмная</span>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex rounded-xl border border-border/30 bg-muted/20 p-0.5 shadow-subtle",
        compact ? "flex-col" : "flex-row",
        className,
      )}
      role="group"
      aria-label="Переключение темы"
    >
      {!compact && (
        <motion.span
          layoutId="theme-switcher-pill"
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className={cn(
            "absolute rounded-lg bg-background shadow-subtle ring-1 ring-border/40",
            isLight ? "left-0.5 right-1/2 top-0.5 bottom-0.5" : "left-1/2 right-0.5 top-0.5 bottom-0.5",
          )}
        />
      )}
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "relative z-10 flex min-h-[36px] min-w-[36px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200",
          compact ? "w-full" : "flex-1",
          isLight ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          compact && isLight && "bg-background shadow-subtle",
        )}
        title="Светлая тема"
      >
        <Sun className="h-4 w-4 shrink-0" />
        {!compact && <span className="hidden sm:inline">Светлая</span>}
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "relative z-10 flex min-h-[36px] min-w-[36px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200",
          compact ? "w-full" : "flex-1",
          !isLight ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          compact && !isLight && "bg-background shadow-subtle",
        )}
        title="Тёмная тема"
      >
        <Moon className="h-4 w-4 shrink-0" />
        {!compact && <span className="hidden sm:inline">Тёмная</span>}
      </button>
    </div>
  );
}
