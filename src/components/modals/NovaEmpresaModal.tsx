"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Building2, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { EmpresaStatus } from "@/types";
import { MEMBERS } from "@/lib/mockData";

interface NovaEmpresaModalProps {
  onClose: () => void;
}

const STATUSES: { id: EmpresaStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: "ativa", label: "Ativa", color: "#22C55E", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
  { id: "em_formacao", label: "Em formação", color: "#F97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)" },
  { id: "inativa", label: "Inativa", color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
];

const PRESET_COLORS = [
  "#4361EE",
  "#7C3AED",
  "#059669",
  "#DB2777",
  "#D97706",
  "#0EA5E9",
];

const SEGMENTS = [
  "Tecnologia",
  "Marketing",
  "Financeiro",
  "Imobiliário",
  "Saúde",
  "Educação",
  "Varejo",
  "Logística",
  "Jurídico",
  "Consultoria",
];

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

export function NovaEmpresaModal({ onClose }: NovaEmpresaModalProps) {
  const { addEmpresa } = useAppStore();

  const [name, setName] = useState("");
  const [segment, setSegment] = useState("Tecnologia");
  const [customSegment, setCustomSegment] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<EmpresaStatus>("ativa");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [responsibleId, setResponsibleId] = useState(MEMBERS[0].id);
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    const responsible = MEMBERS.find((m) => m.id === responsibleId) || MEMBERS[0];
    addEmpresa({
      id: `e${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "Sem descrição",
      segment: customSegment.trim() || segment,
      status,
      color,
      responsible,
      projectCount: 0,
      logo: "",
      initials: initials || name.slice(0, 2).toUpperCase(),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[500px] rounded-[20px] p-6"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Live preview of empresa icon */}
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[13px] font-bold text-white transition-all"
                style={{
                  background: `linear-gradient(135deg, ${color}CC 0%, ${color}88 100%)`,
                  boxShadow: `0 4px 12px ${color}35`,
                }}
              >
                {initials || <Building2 size={16} color="white" />}
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[#EDEDED] tracking-[-0.02em]">
                  Nova Empresa
                </h2>
                <p className="text-[11px] text-[#4A4A58] mt-0.5">
                  Adicionar empresa ao workspace
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-[7px] text-[#4A4A58] hover:text-[#ADADB8] hover:bg-white/[0.06] transition-all"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <InputLabel>Nome *</InputLabel>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder="Ex: TechVentures Brasil..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A]"
                style={{
                  background: "#0C0C14",
                  border: nameFocused
                    ? "1px solid rgba(67,97,238,0.45)"
                    : "1px solid rgba(255,255,255,0.07)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
              />
            </div>

            {/* Segment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel>Segmento</InputLabel>
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] appearance-none cursor-pointer"
                  style={{
                    background: "#0C0C14",
                    border: "1px solid rgba(255,255,255,0.07)",
                    outline: "none",
                  }}
                >
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s} style={{ background: "#111118" }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <InputLabel>Responsável</InputLabel>
                <select
                  value={responsibleId}
                  onChange={(e) => setResponsibleId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] appearance-none cursor-pointer"
                  style={{
                    background: "#0C0C14",
                    border: "1px solid rgba(255,255,255,0.07)",
                    outline: "none",
                  }}
                >
                  {MEMBERS.map((m) => (
                    <option key={m.id} value={m.id} style={{ background: "#111118" }}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <InputLabel>Descrição</InputLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                placeholder="Descreva a empresa e seus objetivos..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A] resize-none"
                style={{
                  background: "#0C0C14",
                  border: descFocused
                    ? "1px solid rgba(67,97,238,0.45)"
                    : "1px solid rgba(255,255,255,0.07)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
              />
            </div>

            {/* Status */}
            <div>
              <InputLabel>Status</InputLabel>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id)}
                    className="flex-1 py-2 rounded-[9px] text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: status === s.id ? s.bg : "rgba(255,255,255,0.03)",
                      color: status === s.id ? s.color : "#4A4A58",
                      border:
                        status === s.id
                          ? `1px solid ${s.border}`
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {status === s.id && <Check size={11} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <InputLabel>Cor de identificação</InputLabel>
              <div className="flex items-center gap-2.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="relative w-8 h-8 rounded-full transition-transform hover:scale-110"
                    style={{ background: c, boxShadow: `0 2px 8px ${c}50` }}
                  >
                    {color === c && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check size={13} color="white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
                {/* Custom color */}
                <label
                  className="relative w-8 h-8 rounded-full cursor-pointer overflow-hidden transition-transform hover:scale-110 flex items-center justify-center text-[10px] text-white font-bold"
                  style={{
                    background:
                      "conic-gradient(#EF4444, #F97316, #EAB308, #22C55E, #4361EE, #7C3AED, #EF4444)",
                    border: "2px solid rgba(255,255,255,0.15)",
                  }}
                  title="Cor personalizada"
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  +
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-2 mt-6 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[9px] text-[12.5px] font-medium text-[#5A5A68] hover:text-[#9A9AA8] hover:bg-white/[0.04] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-[9px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                boxShadow: "0 2px 14px rgba(67,97,238,0.3)",
              }}
            >
              <Building2 size={13} />
              Criar Empresa
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
