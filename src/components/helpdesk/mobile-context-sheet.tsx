"use client";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  UserCircle,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  X,
} from "lucide-react";

const transition = { type: "spring" as const, damping: 28, stiffness: 200 };

export function MobileContextSheet() {
  const open = useUiStore((s) => s.mobileContextSheetOpen);
  const setOpen = useUiStore((s) => s.setMobileContextSheetOpen);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={transition}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-hidden rounded-t-2xl border-t border-border/40 bg-card shadow-[0_-8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.4)] md:hidden"
          >
            <div className="safe-area-pt flex items-center justify-between border-b border-border/30 px-4 py-3">
              <span className="text-section text-foreground">Действия</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <SheetAction icon={Tag} label="Теги" onClick={() => setOpen(false)} />
              <SheetAction icon={CheckCircle} label="Статус" onClick={() => setOpen(false)} />
              <SheetAction icon={UserCircle} label="Назначить" onClick={() => setOpen(false)} />
              <SheetAction icon={AlertTriangle} label="Инцидент" onClick={() => setOpen(false)} />
              <SheetAction icon={Megaphone} label="Рассылка" onClick={() => setOpen(false)} className="col-span-2" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetAction({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[48px] items-center gap-3 rounded-xl border border-border/40 bg-background/80 px-4 py-3 text-left transition hover:bg-muted/50 active:scale-[0.98]",
        className,
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-medium text-foreground">{label}</span>
    </button>
  );
}
