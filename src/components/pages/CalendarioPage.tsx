"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Plus, Trash2, Clock, Bell } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getPriorityConfig } from "@/lib/utils";
import { Task, CalendarioEvent } from "@/types";
import { NovoEventoModal } from "@/components/modals/NovoEventoModal";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const STATUS_COLORS: Record<string, string> = {
  todo: "#3E3E58",
  in_progress: "#4361EE",
  review: "#F97316",
  done: "#22C55E",
};

function TaskPill({ task }: { task: Task }) {
  const color = STATUS_COLORS[task.status] ?? "#4361EE";
  return (
    <div
      className="truncate text-[9.5px] font-medium px-1.5 py-[2px] rounded-[4px] mb-[2px]"
      style={{ background: color + "25", color, border: `1px solid ${color}35` }}
      title={task.title}
    >
      {task.title}
    </div>
  );
}

function EventPill({ event }: { event: CalendarioEvent }) {
  return (
    <div
      className="truncate text-[9.5px] font-semibold px-1.5 py-[2px] rounded-[4px] mb-[2px] flex items-center gap-1"
      style={{
        background: event.color + "28",
        color: event.color,
        border: `1px solid ${event.color}45`,
      }}
      title={`${event.title} — ${event.time}`}
    >
      <span className="shrink-0">●</span>
      <span className="truncate">{event.time} {event.title}</span>
    </div>
  );
}

export function CalendarioPage() {
  const { tasks, calendarioEvents, removeCalendarioEvent, setActivePage } = useAppStore();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [showModal, setShowModal] = useState(false);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  }

  const { days, startOffset } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    return { days: daysInMonth, startOffset: firstWeekday };
  }, [year, month]);

  // Map day → tasks due on that day
  const tasksByDay = useMemo(() => {
    const map: Record<number, Task[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(t);
      }
    });
    return map;
  }, [tasks, year, month]);

  // Map day → events on that day
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarioEvent[]> = {};
    calendarioEvents.forEach((ev) => {
      const d = new Date(ev.date + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    });
    // Sort events by time
    Object.values(map).forEach((evs) => evs.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [calendarioEvents, year, month]);

  const selectedTasks = selectedDay ? (tasksByDay[selectedDay] ?? []) : [];
  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];

  const totalCells = startOffset + days;
  const rows = Math.ceil(totalCells / 7);

  function openModalForDay(dayNum: number) {
    const pad = (n: number) => String(n).padStart(2, "0");
    setModalDefaultDate(`${year}-${pad(month + 1)}-${pad(dayNum)}`);
    setShowModal(true);
  }

  return (
    <div className="h-full overflow-auto px-6 pt-6 pb-6 flex flex-col gap-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between shrink-0"
      >
        <div>
          <p className="text-[11px] text-[#2E2E3A] mb-1 tracking-wider uppercase font-medium">
            Workspace / Calendário
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{ background: "rgba(67,97,238,0.1)", border: "1px solid rgba(67,97,238,0.2)" }}
            >
              <Calendar size={18} color="#4361EE" />
            </div>
            <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">Calendário</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Nav */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[#5A5A70] hover:text-[#ADADB8] hover:bg-white/[0.04] transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[15px] font-semibold text-[#DEDEE8] min-w-[155px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[#5A5A70] hover:text-[#ADADB8] hover:bg-white/[0.04] transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
              setSelectedDay(today.getDate());
            }}
            className="px-3 py-1.5 rounded-[7px] text-[11.5px] font-semibold text-[#4361EE] transition-all hover:bg-[#4361EE]/10"
            style={{ border: "1px solid rgba(67,97,238,0.2)" }}
          >
            Hoje
          </button>

          {/* New Event button */}
          <button
            onClick={() => { setModalDefaultDate(undefined); setShowModal(true); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
              boxShadow: "0 2px 10px rgba(67,97,238,0.3)",
            }}
          >
            <Plus size={13} />
            Novo Evento
          </button>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col min-h-0 rounded-[14px] overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.055)", background: "#14141A" }}
        >
          {/* Weekday headers */}
          <div className="grid grid-cols-7 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-2.5 text-center text-[10.5px] font-semibold uppercase tracking-wider"
                style={{ color: "#3A3A50" }}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
            {Array.from({ length: rows * 7 }, (_, cellIdx) => {
              const dayNum = cellIdx - startOffset + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= days;
              const isToday =
                isCurrentMonth &&
                year === today.getFullYear() &&
                month === today.getMonth() &&
                dayNum === today.getDate();
              const isSelected = isCurrentMonth && dayNum === selectedDay;
              const dayTasks = isCurrentMonth ? (tasksByDay[dayNum] ?? []) : [];
              const dayEvents = isCurrentMonth ? (eventsByDay[dayNum] ?? []) : [];
              const hasItems = dayTasks.length > 0 || dayEvents.length > 0;

              return (
                <div
                  key={cellIdx}
                  onClick={() => {
                    if (!isCurrentMonth) return;
                    setSelectedDay(dayNum === selectedDay ? null : dayNum);
                  }}
                  onDoubleClick={() => isCurrentMonth && openModalForDay(dayNum)}
                  className="p-1.5 transition-all group"
                  style={{
                    borderRight: (cellIdx + 1) % 7 === 0 ? "none" : "1px solid rgba(255,255,255,0.03)",
                    borderBottom: cellIdx < (rows - 1) * 7 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    background: isSelected
                      ? "rgba(67,97,238,0.07)"
                      : isCurrentMonth ? "transparent" : "rgba(0,0,0,0.15)",
                    cursor: isCurrentMonth ? "pointer" : "default",
                  }}
                >
                  {isCurrentMonth && (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="w-[22px] h-[22px] flex items-center justify-center rounded-full text-[11px] font-semibold"
                          style={{
                            background: isToday ? "#4361EE" : "transparent",
                            color: isToday ? "#fff" : isSelected ? "#4361EE" : "#6A6A80",
                          }}
                        >
                          {dayNum}
                        </span>
                        {/* Plus hint on hover */}
                        <button
                          onClick={(e) => { e.stopPropagation(); openModalForDay(dayNum); }}
                          className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(67,97,238,0.2)", color: "#4361EE" }}
                          title="Adicionar evento"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Events first (they have time) */}
                      {dayEvents.slice(0, 2).map((ev) => (
                        <EventPill key={ev.id} event={ev} />
                      ))}

                      {/* Tasks */}
                      {dayTasks.slice(0, dayEvents.length > 0 ? 1 : 2).map((t) => (
                        <TaskPill key={t.id} task={t} />
                      ))}

                      {/* Overflow */}
                      {(dayEvents.length + dayTasks.length) > 3 && (
                        <div className="text-[9px] text-[#4A4A60] font-medium pl-1">
                          +{dayEvents.length + dayTasks.length - 3} mais
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Side panel — selected day */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              key="day-panel"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="w-[250px] shrink-0 rounded-[14px] flex flex-col overflow-hidden"
              style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.055)" }}
            >
              {/* Day header */}
              <div
                className="px-4 pt-4 pb-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-[11px] text-[#3A3A50] font-medium mb-0.5">
                  {WEEKDAYS[new Date(year, month, selectedDay).getDay()]}
                </p>
                <p className="text-[18px] font-bold text-[#EDEDED]">
                  {selectedDay} de {MONTH_NAMES[month]}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedEvents.length > 0 && (
                    <span className="text-[10.5px] text-[#4361EE] font-semibold">
                      {selectedEvents.length} evento{selectedEvents.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {selectedTasks.length > 0 && (
                    <span className="text-[10.5px] text-[#4A4A60]">
                      {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedEvents.length === 0 && selectedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 mt-8">
                    <span className="text-3xl">🗓️</span>
                    <p className="text-[11.5px] text-[#3A3A48] text-center">
                      Sem eventos para este dia
                    </p>
                    <button
                      onClick={() => openModalForDay(selectedDay)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[11.5px] font-semibold text-[#4361EE] transition-all hover:bg-[#4361EE]/10"
                      style={{ border: "1px solid rgba(67,97,238,0.2)" }}
                    >
                      <Plus size={12} />
                      Adicionar evento
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Events */}
                    {selectedEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-[9px] p-3 group/ev"
                        style={{
                          background: ev.color + "12",
                          border: `1px solid ${ev.color}30`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className="w-[6px] h-[6px] rounded-full shrink-0"
                                style={{ background: ev.color }}
                              />
                              <p className="text-[12px] font-semibold truncate" style={{ color: ev.color }}>
                                {ev.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[10px] text-[#4A4A60]">
                                <Clock size={9} />
                                {ev.time}
                              </span>
                              {ev.reminderMinutes > 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-[#4A4A60]">
                                  <Bell size={9} />
                                  {ev.reminderMinutes >= 60
                                    ? `${ev.reminderMinutes / 60}h antes`
                                    : `${ev.reminderMinutes}min antes`}
                                </span>
                              )}
                            </div>
                            {ev.description && (
                              <p className="text-[10.5px] text-[#3A3A50] mt-1 line-clamp-2">{ev.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeCalendarioEvent(ev.id)}
                            className="shrink-0 w-6 h-6 rounded-[6px] flex items-center justify-center opacity-0 group-hover/ev:opacity-100 transition-all hover:bg-red-500/15"
                            style={{ color: "#EF4444" }}
                            title="Remover evento"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Tasks */}
                    {selectedTasks.map((task) => {
                      const pConfig = getPriorityConfig(task.priority);
                      const color = STATUS_COLORS[task.status] ?? "#4361EE";
                      return (
                        <div
                          key={task.id}
                          className="rounded-[9px] p-3 cursor-pointer hover:brightness-110 transition-all"
                          style={{ background: "#1A1A22", border: "1px solid rgba(255,255,255,0.05)" }}
                          onClick={() => setActivePage("tasks")}
                        >
                          <div className="flex items-start gap-2 mb-1.5">
                            <span
                              className="w-[5px] h-[5px] rounded-full shrink-0 mt-1"
                              style={{ background: pConfig.dotColor }}
                            />
                            <p className="text-[11.5px] font-medium text-[#CACAD8] leading-tight">
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 pl-3">
                            <span
                              className="text-[9.5px] px-1.5 py-[2px] rounded-[4px] font-semibold"
                              style={{ background: color + "20", color }}
                            >
                              {task.status === "todo" ? "A fazer" :
                               task.status === "in_progress" ? "Em andamento" :
                               task.status === "review" ? "Revisão" : "Concluído"}
                            </span>
                            <span
                              className="text-[9.5px] px-1.5 py-[2px] rounded-[4px] font-semibold"
                              style={{ background: pConfig.bgColor, color: pConfig.textColor }}
                            >
                              {pConfig.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Add event footer */}
              <div className="p-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => openModalForDay(selectedDay)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-[12px] font-semibold text-[#4361EE] transition-all hover:bg-[#4361EE]/10"
                  style={{ border: "1px solid rgba(67,97,238,0.2)" }}
                >
                  <Plus size={13} />
                  Novo evento neste dia
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-3 shrink-0"
      >
        {[
          { label: "Eventos no mês", value: Object.values(eventsByDay).flat().length, color: "#4361EE" },
          { label: "Tasks no mês", value: Object.values(tasksByDay).flat().length, color: "#7C3AED" },
          { label: "Concluídas", value: Object.values(tasksByDay).flat().filter((t) => t.status === "done").length, color: "#22C55E" },
          {
            label: "Atrasadas",
            value: Object.values(tasksByDay).flat().filter((t) => {
              const due = new Date(t.dueDate + "T00:00:00");
              return due < today && t.status !== "done";
            }).length,
            color: "#EF4444",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 px-3 py-2 rounded-[9px]"
            style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[11px] text-[#3A3A4A]">{s.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[10.5px] text-[#2A2A38]">
          Dica: duplo clique em um dia para criar evento
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <NovoEventoModal
          onClose={() => setShowModal(false)}
          defaultDate={modalDefaultDate}
        />
      )}
    </div>
  );
}
