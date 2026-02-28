"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

const styles: Record<AlertVariant, string> = {
  info: "border-border/60 bg-muted/50 text-foreground",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  error: "border-destructive/40 bg-destructive/10 text-destructive",
};

const icons = { info: Info, success: CheckCircle, warning: AlertTriangle, error: AlertCircle };

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert(props: AlertProps) {
  const { variant = "info", title, children, className } = props;
  const Icon = icons[variant];
  return (
    <div role="alert" className={cn("flex gap-3 rounded-xl border px-4 py-3 text-meta", styles[variant], className)}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium text-foreground mb-0.5">{title}</p>}
        <p className={variant === "info" ? "text-muted-foreground" : "text-inherit"}>{children}</p>
      </div>
    </div>
  );
}

export type { AlertVariant };
