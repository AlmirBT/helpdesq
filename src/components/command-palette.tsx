"use client";

import { Input } from "@/components/ui";
import { useDialogs } from "@/features/dialogs/use-dialogs";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";
import { useIncidentStore } from "@/store/incident-store";
import { useSelectionStore } from "@/store/selection-store";
import { AlertTriangle, Command, Search, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  onSelect: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: dialogs } = useDialogs();
  const router = useRouter();

  const toggleIncidentMode = useIncidentStore(
    (state) => state.toggleIncidentMode,
  );
  const setActiveDialogId = useSelectionStore(
    (state) => state.setActiveDialogId,
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (
        (e.target as HTMLElement | null)?.tagName === "INPUT" ||
        (e.target as HTMLElement | null)?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key.toLowerCase() === "j" && dialogs && dialogs.length > 0) {
        e.preventDefault();
        moveSelection(dialogs, 1, setActiveDialogId);
      }

      if (e.key.toLowerCase() === "k" && dialogs && dialogs.length > 0) {
        e.preventDefault();
        moveSelection(dialogs, -1, setActiveDialogId);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialogs, setActiveDialogId]);

  const items: PaletteItem[] = useMemo(() => {
    const base: PaletteItem[] = [
      {
        id: "go-helpdesk",
        label: "Главная",
        hint: "Дашборд",
        onSelect: () => router.push("/dashboard"),
      },
      {
        id: "toggle-incident",
        label: "Включить или выключить режим инцидента",
        hint: "Массовые действия по обращениям",
        onSelect: () => toggleIncidentMode(),
      },
    ];

    const dialogItems: PaletteItem[] =
      dialogs?.slice(0, 8).map((dlg) => ({
        id: `dlg-${dlg.id}`,
        label: `Обращение: ${dlg.customer}`,
        hint: dlg.subject,
        onSelect: () => {
          setActiveDialogId(dlg.id);
          router.push("/dashboard/requests");
        },
      })) ?? [];

    return [...base, ...dialogItems];
  }, [dialogs, router, setActiveDialogId, toggleIncidentMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint?.toLowerCase().includes(q),
    );
  }, [items, query]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition.fast}
        className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/20 px-4 pt-24 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={transition.normal}
          className="w-full max-w-lg rounded-2xl border border-border/50 bg-card shadow-soft"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Command className="h-4 w-4" />
            </div>
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Быстрые действия: переходы, инциденты, задачи…"
              className="h-9 border-0 bg-transparent shadow-none focus:ring-0"
            />
            <span className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/40 px-2.5 py-1 text-caption text-muted-foreground">
              <Search className="h-3 w-3" />
              ⌘K
            </span>
          </div>
          <div className="max-h-72 space-y-0.5 overflow-y-auto px-2 py-2">
            {filtered.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-meta text-muted-foreground">
                <Zap className="h-4 w-4 shrink-0 text-accent" />
                <span>Ничего не найдено. Попробуйте упростить запрос.</span>
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onSelect();
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-meta text-muted-foreground transition-all duration-150",
                    "hover:bg-accent-soft/60 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {item.hint && (
                    <span className="truncate max-w-[40%] text-caption text-muted-foreground/80">
                      {item.hint}
                    </span>
                  )}
                </button>
              ))
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border/50 px-3 pt-2 text-caption text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-accent" />
                Палитра команд
              </span>
              <span>J / K — навигация по очереди</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function moveSelection(
  dialogs: { id: string }[],
  delta: 1 | -1,
  setActiveDialogId: (id: string) => void,
) {
  const ids = dialogs.map((d) => d.id);
  if (ids.length === 0) return;
  const current = useSelectionStore.getState().activeDialogId;
  const currentIndex = current ? ids.indexOf(current) : 0;
  const nextIndex =
    currentIndex === -1
      ? 0
      : (currentIndex + delta + ids.length) % ids.length;
  setActiveDialogId(ids[nextIndex]);
}

