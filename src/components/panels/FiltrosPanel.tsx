"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Priority, Area } from "@/types";

interface FiltrosPanelProps {
  open: boolean;
  onClose: () => void;
}

const PRIORITIES: { id: Priority; label: string; color: string; dot: string }[] = [
  { id: "high", label: "Alta prioridade", color: "#EF4444", dot: "#EF4444" },
  { id: "medium", label: "Média prioridade", color: "#F97316", dot: "#F97316" },
  { id: "low", label: "Baixa prioridade", color: "#22C55E", dot: "#22C55E" },
];

const CATEGORIES: Area[] = [
  "Desenvolvimento",
  "Financeiro",
  "Marketing",
  "Produtos",
  "Operacional",
  "Administrativo",
  "Estratégia",
  "Documentação",
];

function Checkbox({
  checked,
  onChange,
  color,
}: {
  checked: boolean;
  onChange: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onChange}
      className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-all shrink-0"
      style={{
        background: checked ? (color || "#4361EE") : "transparent",
        border: checked
          ? `1.5px solid ${color || "#4361EE"}`
          : "1.5px solid rgba(255,255,255,0.15)",
      }}
    >
      {checked && (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path
            d="M1 3L3 5L7 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export function FiltrosPanel({ open, onClose }: FiltrosPanelProps) {
  const { taskFilters, setTaskFilters, resetTaskFilters } = useAppStore();

  const totalActive =
    taskFilters.priorities.length + taskFilters.categories.length;

  const togglePriority = (p: Priority) => {
    const updated = taskFilters.priorities.includes(p)
      ? taskFilters.priorities.filter((x) => x !== p)
      : [...taskFilters.priorities, p];
    setTaskFilters({ ...taskFilters, priorities: updated });
  };

  const toggleCategory = (c: Area) => {
    const updated = taskFilters.categories.includes(c)
      ? taskFilters.categories.filter((x) => x !== c)
      : [...taskFilters.categories, c];
    setTaskFilters({ ...taskFilters, categories: updated });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — semi-transparent, click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-30"
            style={{ background: "rgba(0,0,0,0.35)" }}
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 h-full w-[280px] z-40 flex flex-col"
            style={{
              background: "#111118",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-[8px] flex items-center justify-center"
                  style={{
                    background: "rgba(67,97,238,0.12)",
                    border: "1px solid rgba(67,97,238,0.2)",
                  }}
                >
                  <SlidersHorizontal size={13} color="#4361EE" />
                </div>
                <span className="text-[13px] font-bold text-[#DEDEE8]">
                  Filtros
                </span>
                {totalActive > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#4361EE", color: "white" }}
                  >
                    {totalActive}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center rounded-[6px] text-[#4A4A58] hover:text-[#ADADB8] hover:bg-white/[0.06] transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Priority */}
              <div>
                <p className="text-[10.5px] font-semibold text-[#4A4A58] uppercase tracking-wider mb-3">
                  Prioridade
                </p>
                <div className="space-y-2">
                  {PRIORITIES.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={taskFilters.priorities.includes(p.id)}
                        onChange={() => togglePriority(p.id)}
                        color={p.color}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: p.dot }}
                        />
                        <span
                          className="text-[12.5px] font-medium transition-colors"
                          style={{
                            color: taskFilters.priorities.includes(p.id)
                              ? p.color
                              : "#5A5A68",
                          }}
                        >
                          {p.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

              {/* Category */}
              <div>
                <p className="text-[10.5px] font-semibold text-[#4A4A58] uppercase tracking-wider mb-3">
                  Categoria
                </p>
                <div className="space-y-2">
                  {CATEGORIES.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={taskFilters.categories.includes(c)}
                        onChange={() => toggleCategory(c)}
                      />
                      <span
                        className="text-[12.5px] font-medium transition-colors"
                        style={{
                          color: taskFilters.categories.includes(c)
                            ? "#DEDEE8"
                            : "#5A5A68",
                        }}
                      >
                        {c}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            {totalActive > 0 && (
              <div
                className="px-5 py-4 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <button
                  onClick={() => resetTaskFilters()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12.5px] font-semibold transition-all hover:brightness-110"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#EF4444",
                  }}
                >
                  <RotateCcw size={13} />
                  Limpar {totalActive} {totalActive === 1 ? "filtro" : "filtros"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
