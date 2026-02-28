"use client";

import { PageHeader, SectionCard } from "@/components/layout/page-layout";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckSquare, Search, Calendar, Tag, User, ChevronRight } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

type TaskStatus = "open" | "in_progress" | "resolved";

const MOCK_TASKS = [
  { id: "1", title: "Проверить интеграцию с CRM", status: "open" as TaskStatus, priority: "high", dueDate: "2025-03-01", assignee: "Иванов И.", tags: ["Интеграции"] },
  { id: "2", title: "Доработать шаблон ответа по возвратам", status: "in_progress" as TaskStatus, priority: "normal", dueDate: "2025-02-28", assignee: "Вы", tags: ["Шаблоны"] },
  { id: "3", title: "Аудит обращений за февраль", status: "open" as TaskStatus, priority: "low", dueDate: "2025-03-05", assignee: "Петрова А.", tags: ["Отчёт"] },
  { id: "4", title: "Настроить автоответ для праздников", status: "resolved" as TaskStatus, priority: "normal", dueDate: "2025-02-25", assignee: "Вы", tags: ["Автоответы"] },
  { id: "5", title: "Обновить инструкцию для операторов", status: "in_progress" as TaskStatus, priority: "high", dueDate: "2025-03-02", assignee: "Сидоров П.", tags: ["Документация"] },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  open: "Открыта",
  in_progress: "В работе",
  resolved: "Решена",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "border-amber-400/50 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  normal: "border-border/60 bg-muted/50 text-muted-foreground",
  low: "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(() => {
    return MOCK_TASKS.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!deferredSearch.trim()) return true;
      const q = deferredSearch.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
    });
  }, [deferredSearch, statusFilter]);

  return (
    <main className="flex h-full flex-col gap-6 overflow-auto p-6 sm:p-8">
      <PageHeader
        title="Задачи"
        description="Задачи по отделам и тегам. Создаются из обращений."
      />

      <SectionCard>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 max-w-md">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или тегу"
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-9 text-meta"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "open", "in_progress", "resolved"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-caption font-medium transition-all duration-200",
                  statusFilter === s
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {s === "all" ? "Все" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-2xl border border-border/40 bg-background/50 px-4 py-3 transition-all duration-200 hover:border-border/60 hover:bg-muted/30",
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body font-medium text-foreground">{task.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-meta text-muted-foreground">
                  <span className={cn("rounded-lg border px-2 py-0.5 text-caption", PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.normal)}>
                    {task.priority === "high" ? "Высокий" : task.priority === "low" ? "Низкий" : "Обычный"}
                  </span>
                  {task.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <span className="flex items-center gap-1 text-caption text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(task.dueDate)}
                </span>
                <span className="flex items-center gap-1 text-caption text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {task.assignee}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}
