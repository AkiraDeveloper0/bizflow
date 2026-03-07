"use client";

/**
 * EventNotificationManager
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs a tick every 30 seconds and checks if any CalendarioEvent should trigger
 * a notification popup. Each notification is shown **exactly once**:
 *
 *   • "${eventId}-approaching" → fires when remaining time ≤ event.reminderMinutes
 *   • "${eventId}-now"         → fires when the event time is reached (±1 min)
 *
 * Both IDs are persisted in shownEventNotifications so they survive refreshes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Bell, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CalendarioEvent } from "@/types";

type NotifType = "approaching" | "now";

interface ActiveNotif {
  notifId: string;   // "${eventId}-approaching" | "${eventId}-now"
  event: CalendarioEvent;
  type: NotifType;
  minutesLeft: number; // 0 when type === "now"
}

function getMinutesUntilEvent(event: CalendarioEvent): number {
  const now = new Date();
  const [h, m] = event.time.split(":").map(Number);
  const eventDt = new Date(event.date + "T00:00:00");
  eventDt.setHours(h, m, 0, 0);
  return Math.round((eventDt.getTime() - now.getTime()) / 60000);
}

function formatReminderLabel(minutesLeft: number): string {
  if (minutesLeft <= 1) return "Agora!";
  if (minutesLeft < 60) return `Em ${minutesLeft} min`;
  const h = Math.round(minutesLeft / 60);
  return `Em ${h}h`;
}

export function EventNotificationManager() {
  const { calendarioEvents, shownEventNotifications, markEventNotificationShown, setActivePage } =
    useAppStore();

  const [queue, setQueue] = useState<ActiveNotif[]>([]);
  const [current, setCurrent] = useState<ActiveNotif | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoTimer, setAutoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // ── Tick: check events every 30 s ──────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const now = new Date();
      const newNotifs: ActiveNotif[] = [];

      calendarioEvents.forEach((ev) => {
        const minutesLeft = getMinutesUntilEvent(ev);

        // 1. "now" notification — within ±1 min of event time
        const nowId = `${ev.id}-now`;
        if (
          minutesLeft >= -1 &&
          minutesLeft <= 1 &&
          !shownEventNotifications.includes(nowId)
        ) {
          newNotifs.push({ notifId: nowId, event: ev, type: "now", minutesLeft: 0 });
        }

        // 2. "approaching" notification — within reminderMinutes window
        if (ev.reminderMinutes > 0) {
          const approachId = `${ev.id}-approaching`;
          if (
            minutesLeft > 0 &&
            minutesLeft <= ev.reminderMinutes &&
            !shownEventNotifications.includes(approachId) &&
            // Don't fire approaching if "now" already fired
            !shownEventNotifications.includes(`${ev.id}-now`)
          ) {
            newNotifs.push({
              notifId: approachId,
              event: ev,
              type: "approaching",
              minutesLeft,
            });
          }
        }
      });

      if (newNotifs.length > 0) {
        // Mark them all as shown immediately so re-ticks don't re-queue
        newNotifs.forEach((n) => markEventNotificationShown(n.notifId));
        setQueue((prev) => [...prev, ...newNotifs]);
      }
    }

    tick(); // Run once immediately on mount / dep change
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarioEvents, shownEventNotifications]);

  // ── Dequeue: show next notification when current is gone ───────────────────
  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrent(next);
      setIsVisible(true);

      // Auto-dismiss after 15 s
      const t = setTimeout(() => dismiss(), 15_000);
      setAutoTimer(t);
    }
  }, [current, queue]);

  function dismiss() {
    setIsVisible(false);
    if (autoTimer) clearTimeout(autoTimer);
    setTimeout(() => setCurrent(null), 350); // wait for exit animation
  }

  function goToCalendar() {
    setActivePage("calendario");
    dismiss();
  }

  if (!current) return null;

  const { event, type, minutesLeft } = current;
  const isNow = type === "now";
  const accentColor = event.color;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={current.notifId}
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="fixed top-5 right-5 z-[9999] w-[340px] rounded-[16px] overflow-hidden"
          style={{
            background: "#111118",
            border: `1px solid ${accentColor}30`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}18`,
          }}
        >
          {/* Colored top bar */}
          <div
            className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}55)` }}
          />

          {/* Auto-progress bar */}
          <motion.div
            className="h-[2px]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 15, ease: "linear" }}
            style={{ background: accentColor + "55", marginTop: -2 }}
          />

          <div className="p-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: accentColor + "20", border: `1px solid ${accentColor}35` }}
                >
                  {isNow ? (
                    <Calendar size={18} style={{ color: accentColor }} />
                  ) : (
                    <Bell size={18} style={{ color: accentColor }} />
                  )}
                </div>

                <div>
                  <p
                    className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: accentColor }}
                  >
                    {isNow ? "🎯 Evento agora!" : "🔔 Lembrete de evento"}
                  </p>
                  <p className="text-[13.5px] font-bold text-[#EDEDED] leading-tight">
                    {event.title}
                  </p>
                </div>
              </div>

              <button
                onClick={dismiss}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[#4A4A60] hover:text-[#8A8A98] hover:bg-white/[0.07] transition-all"
              >
                <X size={13} />
              </button>
            </div>

            {/* Details */}
            <div
              className="rounded-[10px] px-3 py-2.5 flex items-center gap-3 mb-3"
              style={{ background: "#1A1A24" }}
            >
              <div className="flex items-center gap-1.5 text-[11.5px] text-[#6A6A80]">
                <Clock size={12} style={{ color: accentColor }} />
                <span className="font-semibold text-[#CACAD8]">{event.time}</span>
              </div>
              <div
                className="text-[11.5px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: accentColor + "22", color: accentColor }}
              >
                {isNow ? "Agora!" : formatReminderLabel(minutesLeft)}
              </div>
              {event.description && (
                <p className="text-[10.5px] text-[#3A3A50] truncate flex-1">{event.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToCalendar}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[9px] text-[12px] font-semibold transition-all hover:brightness-110"
                style={{
                  background: accentColor + "22",
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                Ver no calendário
                <ChevronRight size={13} />
              </button>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-[9px] text-[12px] font-medium text-[#4A4A60] hover:text-[#7A7A88] hover:bg-white/[0.04] transition-all"
              >
                Dispensar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
