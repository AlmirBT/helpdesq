/** FunTime HelpDesk — Motion: purposeful, subtle, fast. Micro 120–180ms, panels 200–280ms */

export const duration = { micro: 0.12, fast: 0.15, normal: 0.24, panel: 0.28 } as const;
export const ease = { out: [0.16, 1, 0.3, 1] as const, inOut: [0.65, 0, 0.35, 1] as const };
export const transition = {
  micro: { duration: 0.12, ease: [0.16, 1, 0.3, 1] as const },
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  normal: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const },
  panel: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
};
export const fadeSlideUp = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const },
};
