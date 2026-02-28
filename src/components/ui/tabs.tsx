"use client";

import { cn } from "@/lib/utils";

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
  className?: string;
}

export function Tabs({
  value,
  onValueChange,
  items,
  className,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex rounded-xl border border-border/50 bg-muted/40 p-0.5",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-caption font-medium transition-all duration-150",
            value === item.value
              ? "bg-card text-foreground shadow-subtle"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
