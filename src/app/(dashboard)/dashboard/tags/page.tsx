"use client";

import { PageHeader, SectionCard } from "@/components/layout/page-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Plus, Pencil } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

const MOCK_TAGS = [
  { id: "1", name: "Создан", color: "bg-sky-500", usage: 12 },
  { id: "2", name: "В обработке", color: "bg-amber-500", usage: 8 },
  { id: "3", name: "Завершён", color: "bg-emerald-500", usage: 45 },
  { id: "4", name: "Инцидент", color: "bg-accent", usage: 2 },
  { id: "5", name: "Возврат", color: "bg-violet-500", usage: 5 },
  { id: "6", name: "Документы", color: "bg-slate-500", usage: 3 },
];

export default function TagsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_TAGS;
    const q = search.toLowerCase();
    return MOCK_TAGS.filter((t) => t.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <main className="flex h-full flex-col gap-6 overflow-auto p-6 sm:p-8">
      <PageHeader
        title="Теги"
        description="Теги обращений со статусами. Используются для маршрутизации по отделам."
      />

      <SectionCard>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 max-w-md">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию тега"
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-9 text-meta"
            />
          </div>
          <Button size="sm" className="shrink-0">
            <Plus className="h-4 w-4" />
            Создать тег
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tag) => (
            <div
              key={tag.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-background/50 px-4 py-3 transition-all duration-200 hover:border-border/60 hover:bg-muted/20",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className={cn("h-3 w-3 shrink-0 rounded-full", tag.color)} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{tag.name}</p>
                  <p className="text-caption text-muted-foreground">
                    Использований: {tag.usage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                title="Изменить"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}
