"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

const ROLES = [
  "Сотрудник",
  "Поддержка",
  "Разработчик",
  "Администратор",
] as const;

const PERMISSIONS: { id: string; label: string; hint?: string }[] = [
  { id: "read-requests", label: "Читать обращения", hint: "все / по тегу / по роли" },
  { id: "reply-requests", label: "Отвечать на обращения" },
  { id: "assign-intern", label: "Назначение стажера и смотрящего" },
  { id: "block-users", label: "Блокировка пользователей" },
  { id: "manage-tags", label: "Управление тегами" },
  { id: "manage-breaks", label: "Управление перерывами сотрудников" },
  { id: "manage-shift-priority", label: "Управление приоритетами смен" },
  { id: "manage-templates", label: "Управление шаблонами ответов" },
  { id: "view-stats", label: "Просмотр статистики" },
  { id: "view-employee-stats", label: "Просмотр статистики сотрудников" },
];

const DEFAULT_MATRIX: Record<string, Record<(typeof ROLES)[number], boolean>> = {
  "read-requests": { Сотрудник: false, Поддержка: true, Разработчик: true, Администратор: true },
  "reply-requests": { Сотрудник: false, Поддержка: true, Разработчик: false, Администратор: true },
  "assign-intern": { Сотрудник: false, Поддержка: true, Разработчик: false, Администратор: true },
  "block-users": { Сотрудник: false, Поддержка: false, Разработчик: false, Администратор: true },
  "manage-tags": { Сотрудник: false, Поддержка: false, Разработчик: false, Администратор: true },
  "manage-breaks": { Сотрудник: false, Поддержка: false, Разработчик: false, Администратор: true },
  "manage-shift-priority": { Сотрудник: false, Поддержка: false, Разработчик: false, Администратор: true },
  "manage-templates": { Сотрудник: false, Поддержка: false, Разработчик: false, Администратор: true },
  "view-stats": { Сотрудник: false, Поддержка: true, Разработчик: true, Администратор: true },
  "view-employee-stats": { Сотрудник: false, Поддержка: false, Разработчик: false, Администратор: true },
};

export function PermissionsGrid() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);

  const toggle = (permId: string, role: (typeof ROLES)[number]) => {
    setMatrix((prev) => ({
      ...prev,
      [permId]: {
        ...prev[permId],
        [role]: !prev[permId]?.[role],
      },
    }));
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card/80">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th className="p-3 font-medium text-muted-foreground">
              Право
            </th>
            {ROLES.map((role) => (
              <th
                key={role}
                className="w-24 p-3 text-center font-medium text-foreground"
              >
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSIONS.map((perm) => (
            <tr
              key={perm.id}
              className="border-b border-border/40 last:border-0 hover:bg-muted/20"
            >
              <td className="p-3">
                <span className="font-medium">{perm.label}</span>
                {perm.hint && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({perm.hint})
                  </span>
                )}
              </td>
              {ROLES.map((role) => {
                const checked = matrix[perm.id]?.[role] ?? false;
                return (
                  <td key={role} className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggle(perm.id, role)}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-xl border transition",
                        checked
                          ? "border-accent/60 bg-accent/20 text-accent"
                          : "border-border/60 bg-background/80 text-muted-foreground hover:border-accent/40 hover:bg-accent/5",
                      )}
                      title={checked ? "Отключить" : "Включить"}
                    >
                      {checked ? <Check className="h-4 w-4" /> : null}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border/60 p-3 text-xs text-muted-foreground">
        Отметьте галочкой права для каждой роли. Изменения сохраняются автоматически.
      </p>
    </div>
  );
}
