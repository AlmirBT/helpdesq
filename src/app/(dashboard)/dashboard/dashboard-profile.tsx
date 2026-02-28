"use client";

import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/layout/page-layout";
import { User, Upload, Pencil } from "lucide-react";
import { useState } from "react";

const NAME_REGEX = /^[а-яА-ЯёЁa-zA-Z0-9\s-]+$/;

export function DashboardProfile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    const f = firstName.trim();
    const l = lastName.trim();
    if (!NAME_REGEX.test(f) || !NAME_REGEX.test(l)) {
      setError("Только буквы (а–я, a–z), цифры, пробел и дефис");
      return;
    }
    setUser({ firstName: f, lastName: l });
    setEditing(false);
  };

  if (!user) return null;

  return (
    <SectionCard title="Мой профиль">
      <div className="flex flex-wrap items-start gap-6">
        <div className="relative group">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-muted/50 shadow-subtle">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-card shadow-subtle text-muted-foreground transition-all duration-200 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            title="Загрузить аватар"
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          {editing ? (
            <>
              <div className="flex flex-wrap gap-3">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Имя"
                  className={cn(
                    "rounded-xl border border-border/60 bg-background/90 px-3 py-2 text-body outline-none transition-colors",
                    "focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
                  )}
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Фамилия"
                  className={cn(
                    "rounded-xl border border-border/60 bg-background/90 px-3 py-2 text-body outline-none transition-colors",
                    "focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
                  )}
                />
              </div>
              {error && (
                <p className="text-meta text-destructive">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-accent px-4 py-2 text-body font-medium text-accent-foreground shadow-subtle transition hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setError("");
                  }}
                  className="rounded-xl border border-border/60 px-4 py-2 text-body text-muted-foreground transition hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2"
                >
                  Отмена
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-h2 text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-meta text-muted-foreground">
                Роль: <span className="font-medium text-foreground">{user.role}</span>
              </p>
              <p className="text-meta text-muted-foreground">
                Логин: {user.username}
              </p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-caption font-medium text-muted-foreground transition hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2"
              >
                <Pencil className="h-3.5 w-3.5" />
                Изменить имя
              </button>
            </>
          )}
        </div>
        <div className="rounded-2xl border border-border/40 bg-muted/30 px-5 py-3 text-center">
          <p className="text-2xl font-semibold tabular-nums text-foreground">0</p>
          <p className="text-caption text-muted-foreground">активных задач</p>
        </div>
      </div>
    </SectionCard>
  );
}
