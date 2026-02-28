"use client";

import { useDialogs } from "@/features/dialogs/use-dialogs";
import { cn } from "@/lib/utils";
import { useIncidentStore } from "@/store/incident-store";
import { useSelectionStore } from "@/store/selection-store";
import { useUiStore } from "@/store/ui-store";
import {
  AlertTriangle,
  ArrowRight,
  BadgeInfo,
  Megaphone,
  ChevronDown,
  ChevronRight,
  ListTodo,
  PanelRightClose,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PanelId = "tags" | "tasks" | "incident" | "broadcast" | "activity";

interface DevTask {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

export function ContextPanel() {
  const { data: dialogs } = useDialogs();
  const activeDialogId = useSelectionStore((state) => state.activeDialogId);
  const [expanded, setExpanded] = useState<PanelId[]>([
    "tags",
    "tasks",
    "incident",
    "broadcast",
    "activity",
  ]);

  const [tagsState, setTagsState] = useState<Record<string, string[]>>({});
  const [tasksState, setTasksState] = useState<Record<string, DevTask[]>>({});

  const activeDialog = useMemo(
    () => dialogs?.find((d) => d.id === activeDialogId) ?? null,
    [dialogs, activeDialogId],
  );

  useEffect(() => {
    if (!activeDialog) return;
    setTagsState((prev) =>
      prev[activeDialog.id] !== undefined
        ? prev
        : { ...prev, [activeDialog.id]: activeDialog.tags ?? [] },
    );
  }, [activeDialog?.id]);

  const tags = activeDialog
    ? tagsState[activeDialog.id] ?? activeDialog.tags ?? []
    : [];

  const tasks = activeDialog ? tasksState[activeDialog.id] ?? [] : [];

  const incidentMode = useIncidentStore((state) => state.incidentMode);
  const affectedDialogIds = useIncidentStore((state) => state.affectedDialogIds);
  const setContextPanelOpen = useUiStore((s) => s.setContextPanelOpen);

  const togglePanel = (id: PanelId) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <aside className="hidden h-full min-w-[260px] max-w-xs flex-col rounded-2xl border border-border/40 bg-card/90 p-4 shadow-soft backdrop-blur-xl xl:flex">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-caption uppercase tracking-widest text-muted-foreground">
            Контекст
          </span>
          <span className="text-meta text-muted-foreground">
            Теги, задачи, инциденты
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 rounded-full border border-border/40 bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Поддержка</span>
          </div>
          <button
            type="button"
            onClick={() => setContextPanelOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            title="Скрыть панель"
          >
            <PanelRightClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-xs">
        <Section
          id="tags"
          title="Теги"
          icon={Tag}
          expanded={expanded.includes("tags")}
          onToggle={togglePanel}
        >
          <TagsSection
            tags={tags}
            activeDialogId={activeDialog?.id ?? null}
            onReorder={(next) =>
              activeDialog &&
              setTagsState((prev) => ({ ...prev, [activeDialog.id]: next }))
            }
            onAddTag={(tag) =>
              activeDialog &&
              setTagsState((prev) => ({
                ...prev,
                [activeDialog.id]: [...(prev[activeDialog.id] ?? []), tag],
              }))
            }
          />
        </Section>

        <Section
          id="tasks"
          title="Задачи разработки"
          icon={ListTodo}
          expanded={expanded.includes("tasks")}
          onToggle={togglePanel}
        >
          <TasksSection
            tasks={tasks}
            onChangeTasks={(next) =>
              activeDialog &&
              setTasksState((prev) => ({ ...prev, [activeDialog.id]: next }))
            }
          />
        </Section>

        <Section
          id="incident"
          title="Режим инцидента"
          icon={AlertTriangle}
          accent
          expanded={expanded.includes("incident")}
          onToggle={togglePanel}
        >
          <IncidentSection
            activeDialogId={activeDialog?.id ?? null}
            incidentMode={incidentMode}
            affectedCount={affectedDialogIds.length}
          />
        </Section>

        <Section
          id="broadcast"
          title="Рассылка"
          icon={Megaphone}
          expanded={expanded.includes("broadcast")}
          onToggle={togglePanel}
        >
          <BroadcastSection tags={tags} />
        </Section>

        <Section
          id="activity"
          title="История действий"
          icon={BadgeInfo}
          expanded={expanded.includes("activity")}
          onToggle={togglePanel}
        >
          <ActivityTimeline />
        </Section>
      </div>
    </aside>
  );
}

interface SectionProps {
  id: PanelId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  accent?: boolean;
  onToggle: (id: PanelId) => void;
}

function Section({
  id,
  title,
  icon: Icon,
  expanded,
  accent,
  onToggle,
  children,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background/80 px-2 py-1.5">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-2 text-left text-[11px]"
      >
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border border-border/60 bg-card/80 text-muted-foreground",
              accent && "border-accent/60 bg-accent/5 text-accent",
            )}
          >
            <Icon className="h-3 w-3" />
          </span>
          <span className="font-medium">{title}</span>
        </div>
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
      </button>
      {expanded && <div className="mt-1.5 space-y-1.5 text-[11px]">{children}</div>}
    </section>
  );
}

interface TagsSectionProps {
  tags: string[];
  activeDialogId: string | null;
  onReorder: (tags: string[]) => void;
  onAddTag: (tag: string) => void;
}

function TagsSection({
  tags,
  activeDialogId,
  onReorder,
  onAddTag,
}: TagsSectionProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [newTag, setNewTag] = useState("");

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...tags];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
  };

  return (
    <div className="space-y-1.5">
      {activeDialogId ? (
        <>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <button
                key={tag}
                type="button"
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="inline-flex cursor-grab items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground transition hover:-translate-y-px hover:border-accent/60 hover:text-foreground"
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Добавить тег"
              className="h-7 flex-1 rounded-full border border-border/60 bg-background/90 px-2.5 text-[10px] outline-none ring-0 transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newTag.trim();
                if (!trimmed) return;
                onAddTag(trimmed);
                setNewTag("");
              }}
              className="inline-flex h-7 items-center rounded-full bg-accent px-3 text-[10px] font-medium text-accent-foreground shadow-[0_10px_24px_rgba(248,113,133,0.55)] transition hover:-translate-y-px"
            >
              Добавить
            </button>
          </div>
          <div className="mt-1 flex items-center gap-1 rounded-xl border border-dashed border-border/60 bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            <span>Подсказки по тегам</span>
            <span className="ml-auto h-1.5 w-10 animate-pulse rounded-full bg-muted/70" />
          </div>
        </>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Выберите диалог, чтобы управлять тегами.
        </p>
      )}
    </div>
  );
}

interface TasksSectionProps {
  tasks: DevTask[];
  onChangeTasks: (tasks: DevTask[]) => void;
}

function TasksSection({ tasks, onChangeTasks }: TasksSectionProps) {
  const [draft, setDraft] = useState("");

  const addTask = () => {
    const title = draft.trim();
    if (!title) return;
    const next: DevTask = {
      id: crypto.randomUUID(),
      title,
      status: "todo",
      priority: "medium",
    };
    onChangeTasks([next, ...tasks]);
    setDraft("");
  };

  const toggleStatus = (task: DevTask) => {
    const order: DevTask["status"][] = ["todo", "in-progress", "done"];
    const nextStatus =
      order[(order.indexOf(task.status) + 1) % order.length] ?? "todo";
    onChangeTasks(
      tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)),
    );
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Новая задача для разработчиков"
          className="h-7 flex-1 rounded-full border border-border/60 bg-background/90 px-2.5 text-[10px] outline-none ring-0 transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="button"
          onClick={addTask}
          className="inline-flex h-7 items-center rounded-full border border-border/60 bg-background/90 px-2 text-[10px] text-muted-foreground transition hover:border-accent/60 hover:text-foreground"
        >
          <ArrowRight className="mr-1 h-3 w-3 text-accent" />
          Создать
        </button>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Пока нет задач. Создайте задачи из сообщений обращения.
          </p>
        ) : (
          tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleStatus(task)}
              className="flex w-full items-start gap-1.5 rounded-xl border border-border/60 bg-background/90 px-2 py-1.5 text-left text-[11px] transition hover:border-accent/60 hover:bg-background"
            >
              <span
                className={cn(
                  "mt-0.5 h-1.5 w-1.5 rounded-full",
                  task.status === "todo" && "bg-amber-400",
                  task.status === "in-progress" && "bg-sky-400",
                  task.status === "done" && "bg-emerald-400",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px]">{task.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {task.status === "todo" && "К выполнению"}
                  {task.status === "in-progress" && "В работе"}
                  {task.status === "done" && "Готово"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

interface IncidentSectionProps {
  activeDialogId: string | null;
  incidentMode: boolean;
  affectedCount: number;
}

function IncidentSection({
  activeDialogId,
  incidentMode,
  affectedCount,
}: IncidentSectionProps) {
  const toggleIncidentMode = useIncidentStore(
    (state) => state.toggleIncidentMode,
  );
  const markDialogAffected = useIncidentStore(
    (state) => state.markDialogAffected,
  );
  const unmarkDialogAffected = useIncidentStore(
    (state) => state.unmarkDialogAffected,
  );

  const isCurrentAffected = useIncidentStore((state) =>
    activeDialogId ? state.affectedDialogIds.includes(activeDialogId) : false,
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={toggleIncidentMode}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
            incidentMode
              ? "border-accent/70 bg-accent/10 text-accent shadow-[0_0_0_1px_rgba(248,113,133,0.5),0_14px_30px_rgba(248,113,133,0.4)]"
              : "border-border/70 bg-background/90 text-muted-foreground hover:border-accent/60 hover:text-foreground",
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          {incidentMode ? "Режим инцидента включён" : "Включить режим инцидента"}
        </button>
        <span className="text-[10px] text-muted-foreground">
          Затронуто: <span className="font-medium">{affectedCount}</span>
        </span>
      </div>
      <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-background/90 px-2 py-1.5 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between gap-2">
          <span>Отметить текущее обращение как затронутое</span>
          <button
            type="button"
            disabled={!activeDialogId}
            onClick={() => {
              if (!activeDialogId) return;
              if (isCurrentAffected) {
                unmarkDialogAffected(activeDialogId);
              } else {
                markDialogAffected(activeDialogId);
              }
            }}
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition",
              !activeDialogId && "cursor-not-allowed opacity-50",
              isCurrentAffected
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-accent/15 text-accent",
            )}
          >
            {isCurrentAffected ? "Отмечено" : "Отметить"}
          </button>
        </div>
        <p>
          Используйте режим инцидента для массовых действий: тегирование,
          назначения и рассылки.
        </p>
      </div>
    </div>
  );
}

interface BroadcastSectionProps {
  tags: string[];
}

function BroadcastSection({ tags }: BroadcastSectionProps) {
  const [draft, setDraft] = useState("");
  const [targetTag, setTargetTag] = useState<string>(tags[0] ?? "");

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <select
          value={targetTag}
          onChange={(e) => setTargetTag(e.target.value)}
          className="h-7 min-w-0 flex-1 rounded-full border border-border/60 bg-background/90 px-2.5 text-[10px] outline-none ring-0"
        >
          {tags.length === 0 ? (
            <option value="">Нет тегов для выбора</option>
          ) : (
            tags.map((tag) => (
              <option key={tag} value={tag}>
                Тег: {tag}
              </option>
            ))
          )}
        </select>
        <span className="text-[10px] text-muted-foreground">Сегмент</span>
      </div>
      <textarea
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Краткое, спокойное сообщение для затронутых пользователей…"
        className="w-full resize-none rounded-2xl border border-border/60 bg-background/90 px-2.5 py-1.5 text-[11px] outline-none ring-0 transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
      />
      <div className="rounded-xl border border-border/60 bg-background/90 px-2 py-1.5 text-[10px] text-muted-foreground">
        <div className="mb-1 flex items-center gap-1">
          <Megaphone className="h-3 w-3" />
          <span className="font-medium">Предпросмотр</span>
        </div>
        <p className="line-clamp-3 text-[11px]">
          {draft || "Текст сообщения для рассылки"}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium text-accent-foreground shadow-[0_14px_30px_rgba(248,113,133,0.55)] transition hover:-translate-y-px"
      >
        <Megaphone className="h-3.5 w-3.5" />
        Отправить рассылку
      </button>
    </div>
  );
}

function ActivityTimeline() {
  const items = [
    {
      id: "ev-1",
      time: "5 мин назад",
      label: "Дарья отметила обращение как связанное с инцидентом.",
    },
    {
      id: "ev-2",
      time: "18 мин назад",
      label: "Приоритет установлен: Высокий. Ответственный: дежурный инженер.",
    },
    {
      id: "ev-3",
      time: "32 мин назад",
      label: "Добавлены теги: оплаты, eu-регион.",
    },
  ];

  return (
    <ol className="space-y-1.5 text-[11px]">
      {items.map((item, idx) => (
        <li key={item.id} className="flex gap-2">
          <div className="flex flex-col items-center">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
            {idx < items.length - 1 && (
              <span className="mt-0.5 h-6 w-px bg-border/70" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-muted-foreground/80">{item.time}</p>
            <p>{item.label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}


