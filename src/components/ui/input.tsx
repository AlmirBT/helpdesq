"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

const base =
  "w-full rounded-xl border border-input bg-background/80 text-body text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150 focus:border-accent/50 focus:bg-background focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ className, icon, ...props }: InputProps) {
  if (icon) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          className={cn(base, "pl-9 pr-3 py-2", className)}
          {...props}
        />
      </div>
    );
  }
  return <input className={cn(base, "px-3 py-2", className)} {...props} />;
}
