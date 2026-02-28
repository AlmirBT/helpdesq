"use client";

import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { Cpu, AlertTriangle, Megaphone, LogOut, User, Focus, PanelRight } from "lucide-react";
import { useIncidentStore } from "@/store/incident-store";
import { useUiStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
export function TopBar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const incidentMode = useIncidentStore((state) => state.incidentMode);
  const affectedDialogIds = useIncidentStore((state) => state.affectedDialogIds);
  const affectedCount = affectedDialogIds.length;
  const focusMode = useUiStore((s) => s.focusMode);
  const setFocusMode = useUiStore((s) => s.setFocusMode);
  const contextPanelOpen = useUiStore((s) => s.contextPanelOpen);
  const setContextPanelOpen = useUiStore((s) => s.setContextPanelOpen);
  const todayRequestCount = useUiStore((s) => s.todayRequestCount);

  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "flex flex-col border-b bg-gradient-to-b from-background/70 to-background/95 px-3 backdrop-blur-md",
        incidentMode ? "border-b-accent/40" : "border-b border-border/40",
      )}
    >
      <div className="flex h-11 min-h-[44px] items-center justify-between px-2 md:px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent md:h-7 md:w-7">
            <Cpu className="h-4 w-4 md:h-3.5 md:w-3.5" />
          </div>
          <div className="hidden flex-col gap-0 leading-tight sm:flex">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              FunTime HelpDesk
            </span>
            <span className="text-section text-foreground">
              Рабочее место поддержки
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-caption text-muted-foreground md:gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-border/40 bg-card/60 px-2 py-1 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Ответ &lt; 2 мин</span>
          </div>
          <button
            type="button"
            onClick={() => setContextPanelOpen((p) => !p)}
            className={cn(
              "hidden items-center gap-1 rounded-lg border px-2 py-1 transition-colors duration-150 xl:flex",
              contextPanelOpen
                ? "border-border/40 bg-card/60 text-muted-foreground"
                : "border-accent/40 bg-accent/10 text-accent",
            )}
            title="Панель контекста"
          >
            <PanelRight className="h-3 w-3" />
            <span className="hidden sm:inline text-caption font-medium">Контекст</span>
          </button>
          <button
            type="button"
            onClick={() => setFocusMode((p) => !p)}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-2 py-1 transition-colors duration-150",
              focusMode
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border/40 bg-card/60 text-muted-foreground hover:text-foreground",
            )}
            title="Фокус-режим"
          >
            <Focus className="h-3 w-3" />
            <span className="hidden sm:inline text-caption font-medium">Фокус</span>
          </button>
          {user && (
            <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 pl-1 pr-2 py-1.5 md:pl-1.5 md:py-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent md:h-5 md:w-5">
                <User className="h-4 w-4 md:h-3 md:w-3" />
              </span>
              <span className="hidden font-medium text-caption sm:inline">
                {user.firstName} {user.lastName}
              </span>
              <span className="hidden text-muted-foreground/80 sm:inline text-caption">· {user.role}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-background/80 hover:text-foreground md:h-auto md:w-auto md:p-0.5"
                title="Выйти"
              >
                <LogOut className="h-4 w-4 md:h-3 md:w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {incidentMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-1 flex items-center justify-between gap-2 rounded-lg border border-accent/50 bg-gradient-to-r from-accent/15 via-accent/10 to-transparent px-2 py-0.5 text-[10px] text-accent-foreground"
          >
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/80 text-[9px] font-semibold">
                !
              </span>
              <span className="font-medium">Режим инцидента</span>
              <span className="text-accent-foreground/80">
                {affectedCount > 0 ? `Затронуто: ${affectedCount}` : "Выберите обращения."}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-0.5 rounded border border-accent/60 bg-accent/10 px-1.5 py-0.5 font-medium transition hover:bg-accent/20"
              >
                <Megaphone className="h-2.5 w-2.5" />
                Рассылка
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-0.5 rounded border border-accent/40 bg-background/70 px-1.5 py-0.5 transition hover:bg-background"
              >
                <AlertTriangle className="h-2.5 w-2.5" />
                Действия
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

