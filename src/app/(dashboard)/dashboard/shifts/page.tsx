"use client";

import { PageHeader, SectionCard } from "@/components/layout/page-layout";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock, User, CheckCircle, Calendar } from "lucide-react";
import { useState } from "react";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// Смены по дням месяца (день месяца -> смены)
const MOCK_SHIFTS_BY_DAY: Record<number, Array<{ id: string; start: string; end: string; assignee: string; status: "active" | "scheduled" | "done"; onBreak?: boolean }>> = {
  24: [
    { id: "1", start: "09:00", end: "18:00", assignee: "Иванов И.", status: "done", onBreak: false },
    { id: "2", start: "14:00", end: "22:00", assignee: "Петрова А.", status: "done", onBreak: false },
  ],
  25: [
    { id: "3", start: "09:00", end: "18:00", assignee: "Сидоров П.", status: "done", onBreak: false },
  ],
  26: [
    { id: "4", start: "09:00", end: "18:00", assignee: "Иванов И.", status: "active", onBreak: false },
    { id: "5", start: "14:00", end: "22:00", assignee: "Петрова А.", status: "scheduled", onBreak: false },
  ],
  27: [
    { id: "6", start: "09:00", end: "18:00", assignee: "Вы", status: "scheduled", onBreak: false },
    { id: "7", start: "12:00", end: "20:00", assignee: "Козлова М.", status: "scheduled", onBreak: false },
  ],
  28: [
    { id: "8", start: "09:00", end: "18:00", assignee: "Иванов И.", status: "scheduled", onBreak: false },
  ],
  1: [
    { id: "9", start: "10:00", end: "19:00", assignee: "Петрова А.", status: "scheduled", onBreak: false },
  ],
  2: [],
};

function getCalendarDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstDayOfWeek = first.getDay();
  const mondayFirst = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const daysInMonth = last.getDate();
  const leading = Array(mondayFirst).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const total = leading.length + days.length;
  const trailing = total % 7 === 0 ? [] : Array(7 - (total % 7)).fill(null);
  return [...leading, ...days, ...trailing];
}

export default function ShiftsPage() {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const calendarDays = getCalendarDays(view.year, view.month);

  const prevMonth = () => {
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  };
  const nextMonth = () => {
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
  };
  const goToToday = () => {
    setView({ year: today.getFullYear(), month: today.getMonth() });
  };

  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();
  const isToday = (day: number) => isCurrentMonth && day === today.getDate();

  return (
    <main className="flex h-full flex-col gap-6 overflow-auto p-6 sm:p-8">
      <PageHeader
        title="Смены"
        description="Расписание смен, готовность к смене за 10 минут до начала, перерывы."
      />

      <SectionCard>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
              aria-label="Предыдущий месяц"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="min-w-[180px] text-center text-h2 text-foreground">
              {MONTHS[view.month]} {view.year}
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
              aria-label="Следующий месяц"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={goToToday}
            className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-meta font-medium text-muted-foreground transition hover:bg-accent/10 hover:text-accent"
          >
            <Calendar className="h-4 w-4" />
            Сегодня
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/50">
          <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-section uppercase tracking-wider text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "min-h-[100px] border-b border-r border-border/30 p-2 last:border-r-0 transition-colors",
                  (idx + 1) % 7 === 0 && "border-r-0",
                  !day && "bg-muted/20",
                )}
              >
                {day !== null ? (
                  <>
                    <div
                      className={cn(
                        "mb-2 flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-medium transition-colors",
                        isToday(day)
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground",
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-1.5">
                      {(MOCK_SHIFTS_BY_DAY[day] ?? []).map((shift) => (
                        <div
                          key={shift.id}
                          className={cn(
                            "rounded-lg border px-2 py-1.5 text-[11px] transition-shadow",
                            shift.status === "active" &&
                              "border-accent/40 bg-accent/10 shadow-sm",
                            shift.status === "scheduled" &&
                              "border-border/50 bg-background/80",
                            shift.status === "done" &&
                              "border-border/30 bg-muted/30 text-muted-foreground opacity-80",
                          )}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                            <span className="truncate font-medium">
                              {shift.start}–{shift.end}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 truncate text-muted-foreground">
                            <User className="h-2.5 w-2.5 shrink-0" />
                            {shift.assignee}
                          </div>
                          {shift.status === "active" && (
                            <div className="mt-1 inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                              <CheckCircle className="h-2.5 w-2.5" />
                              В смене
                            </div>
                          )}
                          {shift.status === "scheduled" && (
                            <button
                              type="button"
                              className="mt-1 block w-full rounded border border-border/50 bg-muted/40 py-0.5 text-[10px] font-medium text-muted-foreground transition hover:bg-accent/10 hover:text-accent"
                            >
                              Готов
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-meta text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            Сегодня
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-accent/40 bg-accent/10" />
            В смене
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-border/50 bg-background/80" />
            Запланировано
          </span>
        </div>
      </SectionCard>
    </main>
  );
}
