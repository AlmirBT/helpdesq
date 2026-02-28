"use client";

import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AiAssistantFab() {
  const aiPanelOpen = useUiStore((s) => s.aiPanelOpen);
  const setAiPanelOpen = useUiStore((s) => s.setAiPanelOpen);

  return (
    <motion.button
      type="button"
      onClick={() => setAiPanelOpen((x) => !x)}
      className={cn(
        "fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-2xl border border-border/40 bg-card/90 px-4 py-2.5 shadow-soft backdrop-blur-xl md:bottom-6 md:right-6",
        "transition hover:border-accent/30 hover:shadow-glow-accent",
        aiPanelOpen && "border-accent/40 bg-accent/5",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="AI-помощник"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium">AI-помощник</span>
    </motion.button>
  );
}
