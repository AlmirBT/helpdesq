"use client";

import { useDialogs } from "@/features/dialogs/use-dialogs";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/store/selection-store";
import type { DialogSummary, DialogPriority, DialogPlatform } from "@/types/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  CornerUpRight,
  Flag,
  ListTodo,
  MessageCircle,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useUiStore } from "@/store/ui-store";

type StatusFilter = "all" | "open" | "pending" | "snoozed" | "resolved";
type PriorityFilter = "all" | DialogPriority;
type PlatformFilter = "all" | DialogPlatform;

function formatRelative(isoDate: string): string {
  const date = new Date(isoDate);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3600_000);
  const diffD = Math.floor(diffMs / 86400_000);
  if (diffMin < 1) return "сейчас";
  if (diffMin < 60) return `${diffMin} мин`;
  if (diffH < 24) return `${diffH} ч`;
  if (diffD < 7) return `${diffD} д`;
  return date.toLocaleDateString("ru", { month: "short", day: "numeric" });
}

export function DialogListPanel({ mobile }: { mobile?: boolean } = {}) {
  const { data, isLoading } = useDialogs();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const deferredSearch = useDeferredValue(search);
  const setMobileRequestsView = useUiStore((s) => s.setMobileRequestsView);

  const activeDialogId = useSelectionStore((state) => state.activeDialogId);
  const setActiveDialogId = useSelectionStore((state) => state.setActiveDialogId);

  const handleDialogClick = (dialogId: string) => {
    setActiveDialogId(dialogId);
    if (mobile) setMobileRequestsView("chat");
  };

  const dialogs = data ?? [];

  const filteredDialogs = useMemo(() => {
    if (!dialogs.length) return [];
    const q = deferredSearch.trim().toLowerCase();
    return dialogs.filter((dlg) => {
      if (statusFilter !== "all" && dlg.status !== statusFilter) return false;
      if (priorityFilter !== "all" && dlg.priority !== priorityFilter) return false;
      if (platformFilter !== "all" && dlg.platform !== platformFilter) return false;
      if (!q) return true;
      return (
        dlg.customer.toLowerCase().includes(q) ||
        dlg.subject.toLowerCase().includes(q) ||
        dlg.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [dialogs, deferredSearch, platformFilter, priorityFilter, statusFilter]);

  const hasData = dialogs.length > 0;

  return (
    <section className={cn("flex h-full flex-col rounded-2xl border border-border/40 bg-card/80 p-4 shadow-subtle", !mobile && "min-w-[288px] max-w-[360px]")}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Обращения
          </span>
          <span className="text-[13px] text-muted-foreground">
            Пул по приоритету и каналам
          </span>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по клиенту, теме, тегам"
            icon={<Search className="h-4 w-4" />}
            className="h-10 text-[14px]"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 text-[12px] font-medium text-muted-foreground shadow-subtle transition hover:bg-background hover:text-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Подсказки тегов
        </button>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        <FilterPill
          active={statusFilter === "all"}
          label="Все"
          onClick={() => setStatusFilter("all")}
        />
        <FilterPill
          active={statusFilter === "open"}
          label="Открыты"
          onClick={() => setStatusFilter("open")}
        />
        <FilterPill
          active={statusFilter === "pending"}
          label="В работе"
          onClick={() => setStatusFilter("pending")}
        />
        <FilterPill
          active={priorityFilter === "high"}
          label="Высокий"
          accent
          onClick={() =>
            setPriorityFilter((prev) => (prev === "high" ? "all" : "high"))
          }
        />
        <FilterPill
          active={priorityFilter === "urgent"}
          label="Инцидент"
          accent
          icon={<AlertTriangle className="h-3 w-3" />}
          onClick={() =>
            setPriorityFilter((prev) => (prev === "urgent" ? "all" : "urgent"))
          }
        />
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-border/30 bg-muted/20">
        {isLoading && !hasData ? (
          <div className="flex h-full flex-col gap-2.5 p-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[4.5rem] w-full rounded-xl" />
            ))}
          </div>
        ) : filteredDialogs.length === 0 ? (
          <div className="flex h-full flex-col">
            <EmptyState
              icon={<MessageCircle className="h-5 w-5" />}
              title={!dialogs?.length ? "Новых обращений пока нет." : "По текущему фильтру ничего не найдено"}
              description={
                !dialogs?.length
                  ? "Хороший момент сделать паузу ☕"
                  : "Измените фильтры или поиск — возможно, обращение в другой очереди."
              }
              className="flex-1 text-left"
            />
          </div>
        ) : (
          <Virtuoso
            data={filteredDialogs}
            style={{ height: "100%" }}
            itemContent={(_, dialog) => (
              <DialogListItem
                key={dialog.id}
                dialog={dialog}
                active={dialog.id === activeDialogId}
                onClick={() => handleDialogClick(dialog.id)}
              />
            )}
          />
        )}
      </div>
    </section>
  );
}

interface FilterPillProps {
  label: string;
  active: boolean;
  accent?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
}

function FilterPill({ label, active, accent, icon, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-150",
        "border-border/70 bg-background/70 text-muted-foreground hover:-translate-y-px hover:bg-background hover:text-foreground",
        active &&
          (accent
            ? "border-accent/70 bg-accent-soft/80 text-accent shadow-[0_0_0_1px_rgba(248,113,133,0.45),0_14px_30px_rgba(248,113,133,0.35)]"
            : "border-border bg-muted/80 text-foreground shadow-subtle"),
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface DialogListItemProps {
  dialog: DialogSummary;
  active: boolean;
  onClick: () => void;
}

function DialogListItem({ dialog, active, onClick }: DialogListItemProps) {
  const hasUnread = dialog.unreadCount > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative flex w-full cursor-pointer items-stretch gap-2.5 border-b border-border/40 px-3 py-2.5 text-left last:border-b-0 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-inset touch-manipulation",
        "min-h-[52px] md:min-h-0",
        active && "bg-accent-soft/40",
      )}
    >
      <div className="mt-0.5 flex h-8 w-0.5 flex-none items-stretch">
        <div
          className={cn(
            "h-full w-full rounded-full bg-gradient-to-b opacity-50",
            dialog.priority === "urgent" &&
              "from-accent to-accent/60 shadow-[0_0_0_1px_rgba(248,113,133,0.6),0_18px_38px_rgba(248,113,133,0.55)]",
            dialog.priority === "high" &&
              "from-amber-400/90 to-amber-500/70 shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_14px_30px_rgba(251,191,36,0.4)]",
            dialog.priority === "normal" &&
              "from-sky-400/70 to-sky-500/50 shadow-[0_0_0_1px_rgba(56,189,248,0.4),0_10px_24px_rgba(56,189,248,0.35)]",
            dialog.priority === "low" &&
              "from-emerald-400/70 to-emerald-500/50 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_10px_24px_rgba(52,211,153,0.35)]",
          )}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[13px] font-medium">
                {dialog.customer}
              </span>
              {dialog.hasIncidentTag && (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-accent/40 bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent dark:bg-accent/25 dark:border-accent/50">
                  <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                  Инцидент
                </span>
              )}
            </div>
            <p className="truncate text-[12px] text-muted-foreground">
              {dialog.subject}
            </p>
          </div>
          <div className="ml-1 flex flex-none flex-col items-end gap-0.5">
            <PlatformBadge platform={dialog.platform} />
            <span className="text-[11px] tabular-nums text-muted-foreground/80">
              {formatRelative(dialog.lastMessageAt)}
            </span>
          </div>
        </div>
        <p className="line-clamp-1 text-[12px] text-muted-foreground/90">
          {dialog.lastMessageSnippet}
        </p>
        <div className="flex justify-end gap-1.5 opacity-0 transition group-hover:opacity-100">
          <RowAction icon={CornerUpRight} label="Ответить" />
          <RowAction icon={Tag} label="Тег" />
          <RowAction icon={ListTodo} label="Задача" />
          <RowAction icon={Flag} label="Приоритет" />
        </div>
      </div>
    </div>
  );
}

interface PlatformBadgeProps {
  platform: DialogPlatform;
}

function PlatformBadge({ platform }: PlatformBadgeProps) {
  const labelMap: Record<DialogPlatform, string> = {
    telegram: "Телеграм",
    vk: "ВКонтакте",
    email: "Почта",
    web: "Виджет",
    mobile: "Мобильное",
  };

  const toneMap: Record<DialogPlatform, string> = {
    telegram: "from-sky-400/80 to-sky-500/60 text-sky-50",
    vk: "from-sky-500/80 to-sky-600/60 text-sky-50",
    email: "from-emerald-400/80 to-emerald-500/60 text-emerald-50",
    web: "from-violet-400/80 to-violet-500/60 text-violet-50",
    mobile: "from-orange-400/80 to-orange-500/60 text-orange-50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r px-2 py-0.5 text-[11px] font-medium shadow-subtle",
        toneMap[platform],
      )}
    >
      {labelMap[platform]}
    </span>
  );
}

interface RowActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function RowAction({ icon: Icon, label }: RowActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-card/80 text-muted-foreground shadow-subtle transition hover:border-accent/60 hover:text-foreground"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}


