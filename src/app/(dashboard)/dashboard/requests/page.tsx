"use client";

import { AiAssistantPanel } from "@/components/ai-assistant/ai-assistant-panel";
import { AiAssistantFab } from "@/components/ai-assistant/ai-assistant-fab";
import { ChatWorkspace } from "@/components/helpdesk/chat/chat-workspace";
import { ContextPanel } from "@/components/helpdesk/context/context-panel";
import { MobileContextSheet } from "@/components/helpdesk/mobile-context-sheet";
import { DialogListPanel } from "@/components/helpdesk/dialogs/dialog-list-panel";
import { transition } from "@/lib/motion";
import { useDialogs } from "@/features/dialogs/use-dialogs";
import { useUiStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function RequestsPage() {
  const focusMode = useUiStore((s) => s.focusMode);
  const contextPanelOpen = useUiStore((s) => s.contextPanelOpen);
  const aiPanelOpen = useUiStore((s) => s.aiPanelOpen);
  const setTodayRequestCount = useUiStore((s) => s.setTodayRequestCount);
  const mobileRequestsView = useUiStore((s) => s.mobileRequestsView);
  const { data: dialogs } = useDialogs();

  const showContextPanel = contextPanelOpen && !focusMode;

  useEffect(() => {
    setTodayRequestCount(dialogs?.length ?? 0);
  }, [dialogs?.length, setTodayRequestCount]);

  return (
    <main className="flex h-[calc(100vh-2.75rem)] md:h-[calc(100vh-2.75rem)] w-full gap-3 bg-background/30 px-2 pb-2 pt-2 md:gap-5 md:px-5 md:pb-5 md:pt-5">
      {/* Desktop: 3-column layout */}
      <div className="hidden flex-1 gap-5 md:flex">
        <DialogListPanel />
        <ChatWorkspace />
        <AnimatePresence initial={false}>
          {showContextPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={transition.panel}
              className="overflow-hidden"
            >
              <ContextPanel />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {aiPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={transition.panel}
              className="hidden h-full min-w-0 overflow-hidden xl:block"
            >
              <AiAssistantPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: single-column list or chat with slide */}
      <div className="relative flex flex-1 overflow-hidden md:hidden">
        <AnimatePresence initial={false} mode="wait">
          {mobileRequestsView === "list" ? (
            <motion.div
              key="list"
              initial={{ x: -24 }}
              animate={{ x: 0 }}
              exit={{ x: -24 }}
              transition={transition.normal}
              className="absolute inset-0 flex flex-col"
            >
              <DialogListPanel mobile />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ x: 24 }}
              animate={{ x: 0 }}
              exit={{ x: 24 }}
              transition={transition.normal}
              className="absolute inset-0 flex flex-col"
            >
              <ChatWorkspace mobile />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: context sheet + AI FAB */}
      <MobileContextSheet />
      <AiAssistantFab />
    </main>
  );
}
