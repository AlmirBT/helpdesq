"use client";

import { PageHeader, SectionCard } from "@/components/layout/page-layout";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="flex h-full flex-col gap-6 overflow-auto p-6 sm:p-8">
      <PageHeader
        title="Настройки"
        description="Шаблоны ответов, автоответы, права доступа и общие настройки системы."
      />

      <SectionCard title="Внешний вид">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-body text-muted-foreground">Тема интерфейса</span>
          <ThemeSwitcher className="inline-flex" />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsPanel
          icon={<FileText className="h-5 w-5" />}
          title="Шаблоны ответов"
          description="Готовые фразы и шаблоны для быстрых ответов клиентам."
        />
        <SettingsPanel
          icon={<MessageSquare className="h-5 w-5" />}
          title="Автоответы"
          description="Настройка автоматических сообщений и триггеров."
        />
        <SettingsPanel
          icon={<Shield className="h-5 w-5" />}
          title="Права доступа"
          description="Роли и разрешения для сотрудников."
        />
        <SettingsPanel
          icon={<Sliders className="h-5 w-5" />}
          title="Общие настройки"
          description="Параметры системы и уведомлений."
        />
      </div>
    </main>
  );
}

function SettingsPanel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-start gap-4 rounded-2xl border border-border/40 bg-card/80 p-5 text-left shadow-subtle transition-all duration-200 hover:border-border/60 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-meta text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
