"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { getPriorityConfig } from "@/lib/utils";
import { Task } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  todo: "#3A3A52",
  in_progress: "#4361EE",
  review: "#F97316",
  done: "#22C55E",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "A fazer",
  in_progress: "Em andamento",
  review: "Revisão",
  done: "Concluído",
};

const DAY_WIDTH = 28; // px per day

function parseDate(s: string): Date {
  return new Date(s + "T00:00:00");
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function formatDay(date: Date): string {
  return String(date.getDate()).padStart(2, "0");
}

export function TimelineView() {
  const { tasks, activeProjectId, taskFilters } = useAppStore();

  const projectTasks = useMemo(() => {
    let filtered = tasks.filter((t) => t.projectId === activeProjectId);
    if (taskFilters.priorities.length > 0) {
      filtered = filtered.filter((t) => taskFilters.priorities.includes(t.priority));
    }
    if (taskFilters.categories.length > 0) {
      filtered = filtered.filter((t) => taskFilters.categories.includes(t.category as never));
    }
    return filtered;
  }, [tasks, activeProjectId, taskFilters]);

  // Compute timeline range
  const { startDate, totalDays, months } = useMemo(() => {
    if (projectTasks.length === 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      return {
        startDate: start,
        totalDays: daysBetween(start, end) + 1,
        months: buildMonths(start, end),
      };
    }

    const dates = projectTasks.flatMap((t) => [
      parseDate(t.createdAt),
      parseDate(t.dueDate),
    ]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Pad by 7 days each side
    const start = new Date(minDate);
    start.setDate(start.getDate() - 7);
    // Start from first day of that month
    start.setDate(1);

    const end = new Date(maxDate);
    end.setDate(end.getDate() + 7);
    // End on last day of that month
    end.setMonth(end.getMonth() + 1, 0);

    return {
      startDate: start,
      totalDays: daysBetween(start, end) + 1,
      months: buildMonths(start, end),
    };
  }, [projectTasks]);

  if (projectTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div
          className="w-14 h-14 rounded-[14px] flex items-center justify-center"
          style={{ background: "rgba(67,97,238,0.08)", border: "1px solid rgba(67,97,238,0.15)" }}
        >
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-[13.5px] font-semibold text-[#3A3A48]">Nenhuma task neste projeto</p>
        <p className="text-[12px] text-[#2A2A36]">Crie tasks para visualizar a timeline</p>
      </div>
    );
  }

  const totalWidth = totalDays * DAY_WIDTH;
  const today = new Date();
  const todayOffset = daysBetween(startDate, today);

  return (
    <div className="pb-4">
      <div style={{ overflowX: "auto", overflowY: "visible" }}>
        <div style={{ minWidth: totalWidth + 200, position: "relative" }}>
          {/* ─── Month headers ─── */}
          <div className="flex" style={{ paddingLeft: 200 }}>
            {months.map((m, i) => (
              <div
                key={i}
                style={{ width: m.days * DAY_WIDTH, minWidth: m.days * DAY_WIDTH }}
                className="shrink-0 border-r border-white/5"
              >
                <div
                  className="px-3 py-2 text-[10.5px] font-semibold tracking-wide uppercase"
                  style={{ color: "#4A4A60" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* ─── Day headers ─── */}
          <div
            className="flex border-b"
            style={{ paddingLeft: 200, borderColor: "rgba(255,255,255,0.05)" }}
          >
            {Array.from({ length: totalDays }, (_, i) => {
              const d = new Date(startDate);
              d.setDate(d.getDate() + i);
              const isToday = daysBetween(startDate, today) === i;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div
                  key={i}
                  style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                  className="shrink-0 flex flex-col items-center pb-1"
                >
                  <span
                    className="text-[9px] font-medium"
                    style={{
                      color: isToday ? "#4361EE" : isWeekend ? "#3A3A48" : "#2E2E3C",
                    }}
                  >
                    {formatDay(d)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ─── Task rows ─── */}
          <div className="relative">
            {/* Today line */}
            {todayOffset >= 0 && todayOffset < totalDays && (
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none"
                style={{
                  left: 200 + todayOffset * DAY_WIDTH + DAY_WIDTH / 2,
                  width: 1,
                  background: "rgba(67,97,238,0.5)",
                }}
              />
            )}

            {/* Column alternation */}
            {Array.from({ length: totalDays }, (_, i) => {
              const d = new Date(startDate);
              d.setDate(d.getDate() + i);
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return isWeekend ? (
                <div
                  key={i}
                  className="absolute top-0 bottom-0"
                  style={{
                    left: 200 + i * DAY_WIDTH,
                    width: DAY_WIDTH,
                    background: "rgba(255,255,255,0.015)",
                  }}
                />
              ) : null;
            })}

            {projectTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                startDate={startDate}
                totalDays={totalDays}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  startDate,
  totalDays,
}: {
  task: Task;
  startDate: Date;
  totalDays: number;
}) {
  const created = parseDate(task.createdAt);
  const due = parseDate(task.dueDate);
  const startOffset = Math.max(0, daysBetween(startDate, created));
  const rawDuration = daysBetween(created, due) + 1;
  const duration = Math.min(rawDuration, totalDays - startOffset);

  const barColor = STATUS_COLORS[task.status] ?? "#4361EE";
  const pConfig = getPriorityConfig(task.priority);

  const isOverdue = due < new Date() && task.status !== "done";

  return (
    <div
      className="flex items-center group"
      style={{ height: 44, borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Task label */}
      <div
        className="shrink-0 flex items-center gap-2 px-3"
        style={{ width: 200, minWidth: 200 }}
      >
        <span
          className="w-[5px] h-[5px] rounded-full shrink-0"
          style={{ background: pConfig.dotColor }}
        />
        <span
          className="text-[11.5px] font-medium truncate"
          style={{ color: "#9A9AB0" }}
          title={task.title}
        >
          {task.title}
        </span>
      </div>

      {/* Timeline area */}
      <div className="flex-1 relative" style={{ height: "100%" }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-[5px] flex items-center px-2 gap-1 overflow-hidden transition-all group-hover:brightness-125"
          style={{
            left: startOffset * DAY_WIDTH,
            width: Math.max(duration * DAY_WIDTH, 30),
            height: 22,
            background: isOverdue ? "rgba(239,68,68,0.15)" : `${barColor}22`,
            border: `1px solid ${isOverdue ? "rgba(239,68,68,0.3)" : barColor + "44"}`,
          }}
          title={`${task.createdAt} → ${task.dueDate} · ${STATUS_LABELS[task.status]}`}
        >
          <div
            className="h-[3px] rounded-full shrink-0"
            style={{
              width: `${(task.progress / task.progressTotal) * 100}%`,
              background: isOverdue ? "#EF4444" : barColor,
              maxWidth: "100%",
            }}
          />
          {duration > 2 && (
            <span
              className="text-[9.5px] font-semibold ml-1 truncate"
              style={{ color: isOverdue ? "#EF4444" : barColor }}
            >
              {task.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function buildMonths(start: Date, end: Date) {
  const months: { label: string; days: number }[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const clampedStart = firstDay < start ? start : firstDay;
    const clampedEnd = lastDay > end ? end : lastDay;
    const days = daysBetween(clampedStart, clampedEnd) + 1;
    months.push({
      label: firstDay.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      days,
    });
    cursor.setMonth(cursor.getMonth() + 1, 1);
  }
  return months;
}
