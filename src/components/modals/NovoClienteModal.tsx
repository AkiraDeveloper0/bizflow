"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ClienteStatus, ClienteTipo } from "@/types";
import { MEMBERS } from "@/lib/mockData";

interface NovoClienteModalProps {
  empresaId: string;
  onClose: () => void;
}

const TIPOS: { id: ClienteTipo; label: string }[] = [
  { id: "lead", label: "Lead" },
  { id: "prospect", label: "Prospect" },
  { id: "cliente", label: "Cliente" },
  { id: "parceiro", label: "Parceiro" },
];

const STATUSES: { id: ClienteStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: "lead", label: "Lead", color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" },
  { id: "contato_feito", label: "Contato feito", color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)" },
  { id: "proposta_enviada", label: "Proposta enviada", color: "#C084FC", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.25)" },
  { id: "negociacao", label: "Negociação", color: "#FBBF24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
  { id: "ativo", label: "Ativo", color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  { id: "perdido", label: "Perdido", color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
];

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A]"
      style={{
        background: "#0C0C14",
        border: focused ? "1px solid rgba(67,97,238,0.45)" : "1px solid rgba(255,255,255,0.07)",
        outline: "none",
        transition: "border-color 0.15s",
      }}
    />
  );
}

export function NovoClienteModal({ empresaId, onClose }: NovoClienteModalProps) {
  const { addCliente } = useAppStore();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<ClienteTipo>("lead");
  const [responsavel, setResponsavel] = useState(MEMBERS[0].name);
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [valorPotencial, setValorPotencial] = useState("");
  const [status, setStatus] = useState<ClienteStatus>("lead");
  const [observacoes, setObservacoes] = useState("");
  const [obsFocused, setObsFocused] = useState(false);

  const handleSubmit = () => {
    if (!nome.trim()) return;
    addCliente(empresaId, {
      id: `c${Date.now()}`,
      nome: nome.trim(),
      tipo,
      responsavel,
      telefone,
      email,
      website,
      valorPotencial: valorPotencial ? parseFloat(valorPotencial) : 0,
      status,
      observacoes: observacoes.trim(),
      ultimoContato: new Date().toISOString().slice(0, 10),
      interacoes: [],
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
          className="w-full max-w-[520px] rounded-[20px] p-6 overflow-y-auto"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)",
            maxHeight: "90vh",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(67,97,238,0.2) 0%, rgba(124,58,237,0.2) 100%)",
                  border: "1px solid rgba(67,97,238,0.25)",
                }}
              >
                <Users size={16} color="#4361EE" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[#EDEDED] tracking-[-0.02em]">
                  Novo Cliente
                </h2>
                <p className="text-[11px] text-[#4A4A58] mt-0.5">
                  Adicionar ao CRM
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
            {/* Nome */}
            <div>
              <InputLabel>Nome *</InputLabel>
              <StyledInput value={nome} onChange={setNome} placeholder="Ex: Empresa XYZ..." autoFocus />
            </div>

            {/* Tipo */}
            <div>
              <InputLabel>Tipo</InputLabel>
              <div className="flex gap-2">
                {TIPOS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTipo(t.id)}
                    className="flex-1 py-2 rounded-[9px] text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: tipo === t.id ? "rgba(67,97,238,0.15)" : "rgba(255,255,255,0.03)",
                      color: tipo === t.id ? "#7B93FF" : "#4A4A58",
                      border: tipo === t.id ? "1px solid rgba(67,97,238,0.35)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {tipo === t.id && <Check size={11} />}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <InputLabel>Status no funil</InputLabel>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id)}
                    className="py-2 px-2 rounded-[9px] text-[11.5px] font-semibold transition-all flex items-center justify-center gap-1"
                    style={{
                      background: status === s.id ? s.bg : "rgba(255,255,255,0.03)",
                      color: status === s.id ? s.color : "#4A4A58",
                      border: status === s.id ? `1px solid ${s.border}` : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {status === s.id && <Check size={10} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsável */}
            <div>
              <InputLabel>Responsável</InputLabel>
              <select
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[9px] text-[12.5px] text-[#DEDEE8] appearance-none cursor-pointer"
                style={{ background: "#0C0C14", border: "1px solid rgba(255,255,255,0.07)", outline: "none" }}
              >
                {MEMBERS.map((m) => (
                  <option key={m.id} value={m.name} style={{ background: "#111118" }}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel>Telefone</InputLabel>
                <StyledInput value={telefone} onChange={setTelefone} placeholder="(11) 9 9999-9999" />
              </div>
              <div>
                <InputLabel>E-mail</InputLabel>
                <StyledInput value={email} onChange={setEmail} placeholder="email@empresa.com" type="email" />
              </div>
            </div>

            {/* Website & Valor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel>Website</InputLabel>
                <StyledInput value={website} onChange={setWebsite} placeholder="https://..." />
              </div>
              <div>
                <InputLabel>Valor potencial (R$)</InputLabel>
                <StyledInput value={valorPotencial} onChange={setValorPotencial} placeholder="0" type="number" />
              </div>
            </div>

            {/* Observações */}
            <div>
              <InputLabel>Observações</InputLabel>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                onFocus={() => setObsFocused(true)}
                onBlur={() => setObsFocused(false)}
                placeholder="Anotações sobre o cliente..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A] resize-none"
                style={{
                  background: "#0C0C14",
                  border: obsFocused ? "1px solid rgba(67,97,238,0.45)" : "1px solid rgba(255,255,255,0.07)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
              />
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
              disabled={!nome.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-[9px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                boxShadow: "0 2px 14px rgba(67,97,238,0.3)",
              }}
            >
              <Users size={13} />
              Adicionar Cliente
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
