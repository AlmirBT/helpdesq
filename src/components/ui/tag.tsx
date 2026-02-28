"use client";

import { cn } from "@/lib/utils";
import { Tag as TagIcon } from "lucide-react";

export interface TagPillProps {
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

export function TagPill({ children, className, icon }: TagPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/60 px-2.5 py-0.5 text-caption text-muted-foreground",
        "transition-colors duration-150",
        className,
      )}
    >
      {icon && <TagIcon className="h-3 w-3 shrink-0 opacity-70" />}
      {children}
    </span>
  );
}
