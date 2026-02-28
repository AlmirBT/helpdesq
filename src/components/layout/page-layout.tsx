"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-h1 text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-meta text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="mt-2 flex shrink-0 items-center gap-2 sm:mt-0">{children}</div>}
    </div>
  );
}

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/40 bg-card/80 p-5 shadow-subtle transition-shadow duration-200 hover:shadow-soft/60",
        className,
      )}
    >
      {title && (
        <h2 className="mb-4 text-section uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, sub, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-2xl border border-border/40 bg-card/80 p-4 shadow-subtle transition-all duration-200 hover:border-border/60 hover:shadow-soft/50",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </p>
        {sub && <p className="mt-0.5 text-meta text-muted-foreground">{sub}</p>}
      </div>
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
          {icon}
        </div>
      )}
    </div>
  );
}
