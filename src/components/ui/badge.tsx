"use client";

import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "destructive"
  | "muted";

const variants: Record<BadgeVariant, string> = {
  default: "border-border/60 bg-secondary text-secondary-foreground",
  accent: "border-accent/40 bg-accent/10 text-accent",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  muted: "border-border/40 bg-muted text-muted-foreground",
};

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-caption font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
