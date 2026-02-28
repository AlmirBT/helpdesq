"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDialogs } from "@/features/dialogs/use-dialogs";
import { useMessages } from "@/features/chat/use-messages";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";
import { useSelectionStore } from "@/store/selection-store";
import { useUiStore } from "@/store/ui-store";
import type { Message } from "@/types/message";
import type { DialogSummary } from "@/types/dialog";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CornerUpRight,
  FileText,
  MoreHorizontal,
  Paperclip,
  Send,
  Sparkles,
  Tag,
  User,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { motion } from "framer-motion";

const QUICK_REPLIES = [
  "Приняли, уже смотрим. Вернусь с обновлением в течение 15 минут.",
  "Спасибо за детали — поднимаем инцидент и подключаем команду.",
  "Влияние только на часть пользователей, активируем обходной сценарий.",
];

const STATUS_OPTIONS = [
  { value: "open", label: "Открыто" },
  { value: "pending", label: "В работе" },
  { value: "snoozed", label: "Отложено" },
  { value: "resolved", label: "Решено" },
] as const;

function priorityLabel(priority: string): string {
  const map: Record<string, string> = {
    low: "Низкий",
    normal: "Обычный",
    high: "Высокий",
    urgent: "Срочный",
  };
  return map[priority] ?? priority;
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Сегодня";
  if (d.toDateString() === yesterday.toDateString()) return "Вчера";
  return d.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

type ListItem = { type: "day"; date: string } | { type: "message"; message: Message };

function buildListItems(messages: Message[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDay = "";
  for (const msg of messages) {
    const day = new Date(msg.createdAt).toDateString();
    if (day !== lastDay) {
      lastDay = day;
      items.push({ type: "day", date: msg.createdAt });
    }
    items.push({ type: "message", message: msg });
  }
  return items;
}

export function ChatWorkspace({ mobile }: { mobile?: boolean } = {}) {
  const { data: dialogs } = useDialogs();
  const activeDialogId = useSelectionStore((s) => s.activeDialogId);
  const setActiveDialogId = useSelectionStore((s) => s.setActiveDialogId);
  const setMobileRequestsView = useUiStore((s) => s.setMobileRequestsView);
  const setMobileContextSheetOpen = useUiStore((s) => s.setMobileContextSheetOpen);
  const virtuosoRef = useRef<any>(null);

  const effectiveDialogId = useMemo(() => {
    return (activeDialogId || dialogs?.[0]?.id) ?? null;
  }, [activeDialogId, dialogs]);

  useEffect(() => {
    if (!activeDialogId && dialogs?.[0]) setActiveDialogId(dialogs[0].id);
  }, [activeDialogId, dialogs, setActiveDialogId]);

  const activeDialog = useMemo(
    () => dialogs?.find((d) => d.id === effectiveDialogId) ?? null,
    [dialogs, effectiveDialogId],
  );
  const { data: messages, isLoading } = useMessages(effectiveDialogId);
  const [draft, setDraft] = useState("");
  const [dialogStatus, setDialogStatus] = useState<string>("open");

  const listItems = useMemo(() => (messages ? buildListItems(messages) : []), [messages]);

  const scrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({ index: listItems.length - 1, behavior: "smooth" });
  }, [listItems.length]);

  useEffect(() => {
    if (listItems.length) scrollToBottom();
  }, [effectiveDialogId, listItems.length, scrollToBottom]);

  return (
    <motion.section
      key={effectiveDialogId ?? "empty"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition.normal}
      className={cn("flex h-full min-w-0 flex-1 flex-col border border-border/40 bg-card/80 shadow-subtle", !mobile && "rounded-2xl")}
    >
      <ChatHeader
        dialog={activeDialog}
        status={dialogStatus}
        onStatusChange={setDialogStatus}
        mobile={mobile}
        onBack={mobile ? () => setMobileRequestsView("list") : undefined}
        onOpenContext={mobile ? () => setMobileContextSheetOpen(true) : undefined}
      />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {isLoading && listItems.length === 0 ? (
          <ChatSkeleton />
        ) : listItems.length === 0 && !activeDialog ? (
          <EmptyConversation />
        ) : listItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-meta text-muted-foreground">Пока нет сообщений</p>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={listItems}
            style={{ height: "100%" }}
            followOutput="smooth"
            itemContent={(_, item) =>
              item.type === "day" ? (
                <DaySeparator key={item.date} date={item.date} />
              ) : (
                <MessageBubble key={item.message.id} message={item.message} />
              )
            }
          />
        )}
      </div>
      {activeDialog && (
        <Composer
          draft={draft}
          setDraft={setDraft}
          onSend={() => {}}
          scrollToBottom={scrollToBottom}
        />
      )}
    </motion.section>
  );
}

function DaySeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <span className="rounded-full bg-muted/50 px-4 py-1.5 text-[12px] text-muted-foreground">
        {formatDay(date)}
      </span>
    </div>
  );
}

function EmptyConversation() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
        <CornerUpRight className="h-6 w-6" />
      </div>
      <p className="text-[15px] font-medium text-foreground">Выберите обращение слева</p>
      <p className="max-w-[280px] text-[13px] text-muted-foreground">
        чтобы открыть переписку и ответить клиенту.
      </p>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col justify-end gap-5 p-5">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32 rounded-xl" />
        <Skeleton className="h-16 max-w-[75%] rounded-2xl rounded-bl-md" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-14 w-[70%] max-w-sm rounded-2xl rounded-br-md" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28 rounded-xl" />
        <Skeleton className="h-12 max-w-[60%] rounded-2xl rounded-bl-md" />
      </div>
    </div>
  );
}

interface ChatHeaderProps {
  dialog: DialogSummary | null;
  status: string;
  onStatusChange: (s: string) => void;
  mobile?: boolean;
  onBack?: () => void;
  onOpenContext?: () => void;
}

function ChatHeader({
  dialog,
  status,
  onStatusChange,
  mobile,
  onBack,
  onOpenContext,
}: ChatHeaderProps) {
  const isIncident = dialog?.hasIncidentTag || dialog?.priority === "urgent";

  if (!dialog && !onBack) return null;

  return (
    <div className="flex flex-col gap-3 border-b border-border/30 bg-background/40 px-3 py-2.5 md:px-4 md:py-3">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
            aria-label="Назад к списку"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold text-foreground">
            {dialog?.customer ?? "Чат"}
          </h1>
          <p className="truncate text-[13px] text-muted-foreground">
            {dialog?.subject ?? "Выберите обращение в списке"}
          </p>
        </div>
        {onOpenContext && (
          <button
            type="button"
            onClick={onOpenContext}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
            aria-label="Действия"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>
      {dialog && (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-xl border border-border/50 bg-background/80 px-3 py-2 text-[13px] text-foreground outline-none transition focus:ring-2 focus:ring-accent/20"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/50 px-3 py-1.5 text-[12px] text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-accent/80" />
            {priorityLabel(dialog.priority)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-muted/50 px-2.5 py-1.5 text-[12px] tabular-nums text-muted-foreground">
            Открыт <DialogAgeTimer since={dialog.lastMessageAt} />
          </span>
          {isIncident && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/20 px-3 py-1.5 text-[12px] font-medium text-accent dark:bg-accent/25 dark:border-accent/50">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Инцидент
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.role === "agent" || message.isInternalNote;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.fast}
      className={cn(
        "flex w-full px-4 py-2.5",
        isAgent ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "group max-w-[85%] min-w-0 rounded-2xl px-4 py-3 transition-colors duration-150",
          isAgent
            ? "rounded-br-md bg-accent/10 text-foreground ring-1 ring-accent/20"
            : "rounded-bl-md bg-muted/40 text-foreground ring-1 ring-border/40",
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            {isAgent ? (
              <User className="h-3.5 w-3.5" />
            ) : (
              <User className="h-3.5 w-3.5 text-muted-foreground/80" />
            )}
            <span className="font-medium text-foreground/90">{message.author}</span>
          </span>
        </div>
        <p className="whitespace-pre-line text-[14px] leading-relaxed text-foreground">
          {message.content}
        </p>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="inline-flex items-center gap-2 rounded-xl bg-background/60 px-3 py-2 text-[12px] text-muted-foreground"
              >
                <Paperclip className="h-4 w-4 shrink-0" />
                <span>{att.name}</span>
                {att.sizeLabel && (
                  <span className="text-muted-foreground/70">{att.sizeLabel}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-[12px] text-muted-foreground/80">
          {new Date(message.createdAt).toLocaleTimeString("ru", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="mt-2.5 flex gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <BubbleAction icon={CornerUpRight} label="Ответить" />
          <BubbleAction icon={Tag} label="Тег" />
          <BubbleAction icon={AlertTriangle} label="Инцидент" />
        </div>
      </div>
    </motion.div>
  );
}

function BubbleAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 text-muted-foreground transition hover:bg-accent/20 hover:text-accent"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function DialogAgeTimer({ since }: { since: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const started = new Date(since).getTime();
  if (!Number.isFinite(started) || started <= 0 || started > now) {
    return <span>0 мин</span>;
  }

  const diffMs = now - started;
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let label: string;
  if (hours > 0) {
    label = `${hours} ч ${minutes} мин`;
  } else {
    label = `${minutes} мин`;
  }

  return <span>{label}</span>;
}

interface ComposerProps {
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
  scrollToBottom: () => void;
}

function Composer({ draft, setDraft, onSend }: ComposerProps) {
  return (
    <div className="sticky bottom-0 border-t border-border/30 bg-background/80 px-3 py-3 backdrop-blur-sm safe-area-pb md:px-4 md:py-4">
      <div className="mb-3 flex flex-wrap gap-2.5">
        {QUICK_REPLIES.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setDraft(text)}
            className="inline-flex max-w-[260px] items-center gap-2 rounded-xl border border-border/40 bg-card/60 px-3.5 py-2 text-left text-[13px] text-muted-foreground transition hover:border-accent/30 hover:bg-accent/5 hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent/80" />
            <span className="line-clamp-1 truncate">{text}</span>
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2.5">
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Напишите ответ…"
          className="min-h-[48px] flex-1 resize-none rounded-2xl border border-border/50 bg-background/90 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            title="Шаблоны"
          >
            <FileText className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent/20 hover:text-accent"
            title="AI подсказка ответа"
          >
            <Bot className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            title="Прикрепить"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onSend}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-subtle transition hover:bg-accent/90 active:scale-[0.98]"
            title="Отправить (Enter)"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground/80">
        Enter — отправить, Shift+Enter — новая строка
      </p>
    </div>
  );
}
