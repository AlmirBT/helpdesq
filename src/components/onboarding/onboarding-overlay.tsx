"use client";

import { transition } from "@/lib/motion";
import { useUiStore } from "@/store/ui-store";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Inbox, Clock, Zap, X } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: "requests",
    title: "Обращения",
    description:
      "Здесь вся очередь обращений. Выберите диалог, чтобы ответить клиенту.",
    navId: "requests" as const,
    icon: Inbox,
  },
  {
    id: "shifts",
    title: "Смены",
    description:
      "Расписание смен и кто сейчас на линии. Удобно для координации с коллегами.",
    navId: "shifts" as const,
    icon: Clock,
  },
  {
    id: "quick",
    title: "Быстрый режим",
    description:
      "Нажмите ⌘K (или Ctrl+K) в любой момент — откроется поиск и быстрые действия.",
    navId: null,
    icon: Zap,
  },
];

export function OnboardingOverlay() {
  const pathname = usePathname();
  const completed = useUiStore((s) => s.onboardingCompleted);
  const setOnboardingCompleted = useUiStore((s) => s.setOnboardingCompleted);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (completed) return;
    const isDashboard = pathname?.startsWith("/dashboard");
    if (isDashboard) setVisible(true);
    else setVisible(false);
  }, [pathname, completed]);

  const handleSkip = () => {
    setOnboardingCompleted(true);
    setVisible(false);
  };

  const handleNext = () => {
    if (step >= STEPS.length - 1) {
      setOnboardingCompleted(true);
      setVisible(false);
    } else {
      setStep((s) => s + 1);
    }
  };

  const current = STEPS[step];
  if (!visible || !current) return null;

  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={transition.normal}
          className={cn(
            "relative w-full max-w-sm rounded-2xl border border-border/40 bg-card/95 p-5 shadow-soft backdrop-blur-xl",
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Пропустить"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {current.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {current.description}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              Пропустить подсказки
            </button>
            {current.navId ? (
              <Link
                href={
                  current.navId === "requests"
                    ? "/dashboard/requests"
                    : "/dashboard/shifts"
                }
                onClick={handleNext}
                className="rounded-xl bg-accent px-4 py-2 text-xs font-medium text-accent-foreground shadow-subtle transition hover:bg-accent/90"
              >
                {step >= STEPS.length - 1 ? "Готово" : "Далее"}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-accent px-4 py-2 text-xs font-medium text-accent-foreground shadow-subtle transition hover:bg-accent/90"
              >
                {step >= STEPS.length - 1 ? "Готово" : "Далее"}
              </button>
            )}
          </div>
          <div className="mt-3 flex gap-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i === step ? "bg-accent/80" : "bg-muted",
                )}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
