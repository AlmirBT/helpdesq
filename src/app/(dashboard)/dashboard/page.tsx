import Link from "next/link";
import { DashboardProfile } from "./dashboard-profile";
import { PageHeader, SectionCard, StatCard } from "@/components/layout/page-layout";
import { Inbox, CheckSquare, Clock, ArrowRight, Users, Tag, Settings } from "lucide-react";

export default function DashboardHomePage() {
  return (
    <main className="flex h-full flex-col gap-8 overflow-auto p-6 sm:p-8">
      <PageHeader
        title="Главная"
        description="Добро пожаловать в FunTime HelpDesk. Краткая сводка и быстрый доступ к разделам."
      />

      <DashboardProfile />

      <section>
        <h2 className="mb-4 text-section uppercase tracking-wider text-muted-foreground">
          Краткая сводка
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Обращения сегодня"
            value="—"
            sub="в работе и новые"
            icon={<Inbox className="h-5 w-5" />}
          />
          <StatCard
            label="Активные задачи"
            value="0"
            sub="назначены вам"
            icon={<CheckSquare className="h-5 w-5" />}
          />
          <StatCard
            label="Ближайшая смена"
            value="—"
            sub="расписание"
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-section uppercase tracking-wider text-muted-foreground">
          Разделы
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NavCard
            title="Обращения"
            href="/dashboard/requests"
            description="Пул обращений и диалоги с пользователями"
            icon={<Inbox className="h-5 w-5" />}
          />
          <NavCard
            title="Задачи"
            href="/dashboard/tasks"
            description="Задачи по отделам и тегам"
            icon={<CheckSquare className="h-5 w-5" />}
          />
          <NavCard
            title="Пользователи"
            href="/dashboard/users"
            description="Сотрудники и роли"
            icon={<Users className="h-5 w-5" />}
          />
          <NavCard
            title="Теги"
            href="/dashboard/tags"
            description="Теги обращений и маршрутизация"
            icon={<Tag className="h-5 w-5" />}
          />
          <NavCard
            title="Смены"
            href="/dashboard/shifts"
            description="Расписание и готовность к смене"
            icon={<Clock className="h-5 w-5" />}
          />
          <NavCard
            title="Настройки"
            href="/dashboard/settings"
            description="Шаблоны, автоответы, права доступа"
            icon={<Settings className="h-5 w-5" />}
          />
        </div>
      </section>
    </main>
  );
}

function NavCard({
  title,
  href,
  description,
  icon,
}: {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-border/40 bg-card/80 p-5 shadow-subtle transition-all duration-200 hover:border-border/60 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors duration-200 group-hover:bg-accent/10 group-hover:text-accent">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-body font-medium text-foreground group-hover:text-accent">
          {title}
        </span>
        <p className="mt-1 text-meta text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}
