"use client";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-8 text-center",
        className,
      )}
    >
      {icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
          {icon}
        </span>
      )}
      <div className="space-y-1">
        <p className="text-section text-foreground">{title}</p>
        {description && (
          <p className="text-meta text-muted-foreground max-w-[280px]">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
