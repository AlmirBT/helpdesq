"use client";

import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  X,
  MessageSquare,
  Tag,
  Heart,
  AlertTriangle,
  FileText,
  LayoutTemplate,
  ArrowUpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  {
    id: "reply",
    icon: MessageSquare,
    title: "Подсказка ответа",
    placeholder: "AI предложит формулировку ответа по контексту диалога.",
  },
  {
    id: "tags",
    icon: Tag,
    title: "Подсказка тегов",
    placeholder: "Рекомендуемые теги по содержанию обращения.",
  },
  {
    id: "sentiment",
    icon: Heart,
    title: "Тональность",
    placeholder: "Нейтральная / позитивная / негативная.",
  },
  {
    id: "escalation",
    icon: AlertTriangle,
    title: "Риск эскалации",
    placeholder: "Пока нет признаков эскалации.",
  },
  {
    id: "summary",
    icon: FileText,
    title: "Краткое содержание",
    placeholder: "Краткое саммари длинного диалога.",
  },
  {
    id: "template",
    icon: LayoutTemplate,
    title: "Шаблон ответа",
    placeholder: "Подходящий шаблон из базы.",
  },
  {
    id: "priority",
    icon: ArrowUpCircle,
    title: "Смена приоритета",
    placeholder: "Рекомендация по приоритету по содержанию.",
  },
];

export function AiAssistantPanel() {
  const open = useUiStore((s) => s.aiPanelOpen);
  const setAiPanelOpen = useUiStore((s) => s.setAiPanelOpen);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 320, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/90 shadow-soft backdrop-blur-xl"
      >
        <header className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <span className="text-sm font-semibold">AI-помощник</span>
              <p className="text-[10px] text-muted-foreground">
                Подсказки по обращению
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAiPanelOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={cn(
                  "rounded-xl border border-border/40 bg-background/60 p-3",
                  "transition hover:border-border/60",
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Icon className="h-3.5 w-3.5 text-accent/80" />
                  {s.title}
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  {s.placeholder}
                </p>
              </div>
            );
          })}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
