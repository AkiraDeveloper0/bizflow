"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Priority, TaskStatus, Area } from "@/types";

interface NovaTaskModalProps {
  onClose: () => void;
}

const PRIORITIES: { id: Priority; label: string; color: string; bg: string; border: string }[] = [
  { id: "high", label: "Alta", color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
  { id: "medium", label: "Média", color: "#F97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)" },
  { id: "low", label: "Baixa", color: "#22C55E", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
];

const CATEGORIES: Area[] = [
  "Desenvolvimento",
  "Financeiro",
  "Operacional",
  "Marketing",
  "Produtos",
  "Administrativo",
  "Estratégia",
  "Documentação",
];

const STATUS_OPTIONS: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "Em andamento" },
  { id: "review", label: "Revisão" },
  { id: "done", label: "Concluído" },
];

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

function inputStyle(focused: boolean = false): React.CSSProperties {
  return {
    background: "#0C0C14",
    border: focused
      ? "1px solid rgba(67,97,238,0.45)"
      : "1px solid rgba(255,255,255,0.07)",
    outline: "none",
    transition: "border-color 0.15s",
  };
}

export function NovaTaskModal({ onClose }: NovaTaskModalProps) {
  const { addTask, projects, members } = useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Area>("Desenvolvimento");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [projectId, setProjectId] = useState(projects[0]?.id || "p1");
  const [dueDate, setDueDate] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const due = dueDate ? new Date(dueDate) : new Date();
    const now = new Date();
    const daysLeft = Math.max(
      0,
      Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    addTask({
      id: `t${Date.now()}`,
      projectId,
      title: title.trim(),
      description: description.trim() || "Sem descrição",
      status,
      priority,
      category,
      comments: 0,
      attachments: 0,
      daysLeft,
      progress: 0,
      progressTotal: 10,
      members: members.filter((m) => selectedMembers.includes(m.id)),
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      tags: [],
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
          className="w-full max-w-[520px] rounded-[20px] p-6 max-h-[90vh] overflow-y-auto"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{
                  background: "rgba(67,97,238,0.15)",
                  border: "1px solid rgba(67,97,238,0.28)",
                }}
              >
                <Plus size={16} color="#4361EE" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[#EDEDED] tracking-[-0.02em]">
                  Nova Task
                </h2>
                <p className="text-[11px] text-[#4A4A58] mt-0.5">
                  Adicionar tarefa ao projeto
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
            {/* Title */}
            <div>
              <InputLabel>Título *</InputLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
                placeholder="Ex: Implementar autenticação OAuth..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A]"
                style={inputStyle(titleFocused)}
              />
            </div>

            {/* Description */}
            <div>
              <InputLabel>Descrição</InputLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                placeholder="Descreva a tarefa com mais detalhes..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A] resize-none"
                style={inputStyle(descFocused)}
              />
            </div>

            {/* Priority */}
            <div>
              <InputLabel>Prioridade</InputLabel>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriority(p.id)}
                    className="flex-1 py-2 rounded-[9px] text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: priority === p.id ? p.bg : "rgba(255,255,255,0.03)",
                      color: priority === p.id ? p.color : "#4A4A58",
                      border:
                        priority === p.id
                          ? `1px solid ${p.border}`
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {priority === p.id && <Check size={11} />}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel>Categoria</InputLabel>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Area)}
                    className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] appearance-none cursor-pointer"
                    style={{
                      background: "#0C0C14",
                      border: "1px solid rgba(255,255,255,0.07)",
                      outline: "none",
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: "#111118" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <InputLabel>Status</InputLabel>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] appearance-none cursor-pointer"
                  style={{
                    background: "#0C0C14",
                    border: "1px solid rgba(255,255,255,0.07)",
                    outline: "none",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id} style={{ background: "#111118" }}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project + Due date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel>Projeto</InputLabel>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] appearance-none cursor-pointer"
                  style={{
                    background: "#0C0C14",
                    border: "1px solid rgba(255,255,255,0.07)",
                    outline: "none",
                  }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} style={{ background: "#111118" }}>
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <InputLabel>Data de entrega</InputLabel>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] cursor-pointer"
                  style={{
                    background: "#0C0C14",
                    border: "1px solid rgba(255,255,255,0.07)",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>

            {/* Members */}
            <div>
              <InputLabel>Responsáveis</InputLabel>
              <div className="flex gap-2 flex-wrap">
                {members.map((m) => {
                  const isSelected = selectedMembers.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      className="flex items-center gap-2 px-2.5 py-[7px] rounded-[9px] text-[12px] font-medium transition-all"
                      style={{
                        background: isSelected
                          ? `${m.color}18`
                          : "rgba(255,255,255,0.04)",
                        color: isSelected ? m.color : "#5A5A68",
                        border: isSelected
                          ? `1px solid ${m.color}35`
                          : "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                        style={{ background: m.color }}
                      >
                        {m.initials}
                      </span>
                      {m.name.split(" ")[0]}
                      {isSelected && <Check size={11} />}
                    </button>
                  );
                })}
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
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-[9px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                boxShadow: "0 2px 14px rgba(67,97,238,0.3)",
              }}
            >
              <Plus size={13} />
              Criar Task
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
