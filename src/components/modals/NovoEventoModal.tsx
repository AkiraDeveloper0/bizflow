"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Bell, AlignLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CalendarioEvent } from "@/types";

const EVENT_COLORS = [
  { value: "#4361EE", label: "Azul" },
  { value: "#7C3AED", label: "Roxo" },
  { value: "#059669", label: "Verde" },
  { value: "#EF4444", label: "Vermelho" },
  { value: "#F97316", label: "Laranja" },
  { value: "#DB2777", label: "Rosa" },
  { value: "#0EA5E9", label: "Ciano" },
];

const REMINDER_OPTIONS = [
  { value: 0, label: "Sem lembrete" },
  { value: 5, label: "5 minutos antes" },
  { value: 15, label: "15 minutos antes" },
  { value: 30, label: "30 minutos antes" },
  { value: 60, label: "1 hora antes" },
  { value: 120, label: "2 horas antes" },
  { value: 1440, label: "1 dia antes" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

interface Props {
  onClose: () => void;
  defaultDate?: string; // "YYYY-MM-DD"
}

export function NovoEventoModal({ onClose, defaultDate }: Props) {
  const { addCalendarioEvent } = useAppStore();

  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate ?? today);
  const [time, setTime] = useState("09:00");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4361EE");
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!title.trim()) { setError("O título é obrigatório."); return; }
    if (!date) { setError("Selecione uma data."); return; }
    if (!time) { setError("Selecione um horário."); return; }

    const event: CalendarioEvent = {
      id: uid(),
      title: title.trim(),
      date,
      time,
      description: description.trim(),
      color,
      reminderMinutes,
    };

    addCalendarioEvent(event);
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="w-full max-w-[440px] rounded-[18px] flex flex-col"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 pt-5 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[9px] flex items-center justify-center"
                style={{ background: `${color}22`, border: `1px solid ${color}44` }}
              >
                <Calendar size={15} style={{ color }} />
              </div>
              <h2 className="text-[15px] font-bold text-[#EDEDED]">Novo Evento</h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#5A5A70] hover:text-[#ADADB8] hover:bg-white/[0.06] transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Color bar */}
            <div
              className="h-1 rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }}
            />

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-1.5">
                Título *
              </label>
              <input
                autoFocus
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(""); }}
                placeholder="Ex: Reunião com cliente, Deadline do projeto..."
                className="w-full px-3 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3E] outline-none transition-all"
                style={{ background: "#1A1A24", border: "1px solid rgba(255,255,255,0.07)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = `${color}60`)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-1.5">
                  <Calendar size={11} /> Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] outline-none transition-all"
                  style={{
                    background: "#1A1A24",
                    border: "1px solid rgba(255,255,255,0.07)",
                    colorScheme: "dark",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = `${color}60`)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-1.5">
                  <Clock size={11} /> Horário
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] outline-none transition-all"
                  style={{
                    background: "#1A1A24",
                    border: "1px solid rgba(255,255,255,0.07)",
                    colorScheme: "dark",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = `${color}60`)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-1.5">
                <AlignLeft size={11} /> Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes do evento (opcional)"
                rows={2}
                className="w-full px-3 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3E] outline-none resize-none transition-all"
                style={{ background: "#1A1A24", border: "1px solid rgba(255,255,255,0.07)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = `${color}60`)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            {/* Reminder */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-1.5">
                <Bell size={11} /> Lembrete
              </label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] outline-none transition-all"
                style={{
                  background: "#1A1A24",
                  border: "1px solid rgba(255,255,255,0.07)",
                  colorScheme: "dark",
                }}
              >
                {REMINDER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-2">
                Cor do evento
              </label>
              <div className="flex items-center gap-2">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                    className="w-7 h-7 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                    style={{
                      background: c.value,
                      boxShadow: color === c.value ? `0 0 0 2px #111118, 0 0 0 4px ${c.value}` : "none",
                      transform: color === c.value ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-400 font-medium">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-2.5 px-5 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[9px] text-[12.5px] font-medium text-[#5A5A70] hover:text-[#8A8A98] hover:bg-white/[0.04] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-[9px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}BB 100%)`,
                boxShadow: `0 2px 12px ${color}40`,
              }}
            >
              <Calendar size={13} />
              Criar Evento
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
