"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground shadow-subtle hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 active:scale-[0.98]",
  secondary: "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 active:scale-[0.98]",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-2 active:scale-[0.98]",
  destructive: "bg-destructive text-destructive-foreground shadow-subtle hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 rounded-xl px-3 text-caption",
  md: "h-9 rounded-xl px-4 text-body font-medium",
  lg: "h-10 rounded-xl px-6 text-body font-medium",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
