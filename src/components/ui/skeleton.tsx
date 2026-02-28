"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/60",
        className,
      )}
      aria-hidden
    />
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3", className)} />;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <Skeleton className={cn("h-20", className)} />;
}
