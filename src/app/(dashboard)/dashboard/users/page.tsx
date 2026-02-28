"use client";

import { PageHeader, SectionCard } from "@/components/layout/page-layout";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, User, Mail, Shield, MoreHorizontal } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

const MOCK_USERS = [
  { id: "1", name: "Иванов Иван", role: "Администратор", email: "ivanov@company.ru", status: "active" },
  { id: "2", name: "Петрова Анна", role: "Оператор", email: "petrova@company.ru", status: "active" },
  { id: "3", name: "Сидоров Пётр", role: "Оператор", email: "sidorov@company.ru", status: "active" },
  { id: "4", name: "Козлова Мария", role: "Модератор", email: "kozlova@company.ru", status: "active" },
  { id: "5", name: "Николаев Алексей", role: "Оператор", email: "nikolaev@company.ru", status: "away" },
];

const ROLE_STYLES: Record<string, string> = {
  Администратор: "border-accent/40 bg-accent/10 text-accent",
  Оператор: "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Модератор: "border-violet-400/40 bg-violet-500/10 text-violet-700 dark:text-violet-400",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_USERS;
    const q = search.toLowerCase();
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <main className="flex h-full flex-col gap-6 overflow-auto p-6 sm:p-8">
      <PageHeader
        title="Пользователи"
        description="Сотрудники поддержки, разработчики и администраторы. Создание пользователей доступно только администраторам."
      />

      <SectionCard>
        <div className="mb-4 max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, почте или роли"
            icon={<Search className="h-3.5 w-3.5" />}
            className="h-9 text-meta"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/40">
          <table className="w-full text-left text-body">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-4 py-3 text-section text-muted-foreground">Пользователь</th>
                <th className="px-4 py-3 text-section text-muted-foreground">Роль</th>
                <th className="hidden px-4 py-3 text-section text-muted-foreground sm:table-cell">Почта</th>
                <th className="px-4 py-3 text-section text-muted-foreground">Статус</th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/30 transition-colors hover:bg-muted/20 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-caption font-medium",
                        ROLE_STYLES[user.role] ?? "border-border/60 bg-muted/50 text-muted-foreground",
                      )}
                    >
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-meta text-muted-foreground sm:table-cell">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption",
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {user.status === "active" ? "В сети" : "Отошёл"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                      title="Действия"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </main>
  );
}
