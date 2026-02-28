"use client";

import { transition } from "@/lib/motion";
import { Sidebar } from "@/components/layout/sidebar";
import { useUiStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const focusMode = useUiStore((s) => s.focusMode);
  const mobileSidebarOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop sidebar */}
      <AnimatePresence initial={false}>
        {!focusMode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={transition.panel}
            className="hidden overflow-hidden md:block"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fast}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              aria-hidden
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] md:hidden"
            >
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
