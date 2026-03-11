"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import {
  Plus, LayoutGrid, List, ArrowLeft, Phone, Mail, Globe,
  DollarSign, User, MessageSquare, PhoneCall, Calendar,
  Send, ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Cliente, ClienteStatus, InteracaoTipo, Interacao } from "@/types";
import { NovoClienteModal } from "@/components/modals/NovoClienteModal";

// ─── Column config ────────────────────────────────────────────────────────────

const COLUMNS: { id: ClienteStatus; label: string; color: string; dot: string }[] = [
  { id: "lead", label: "Lead", color: "#94A3B8", dot: "#64748B" },
  { id: "contato_feito", label: "Contato feito", color: "#60A5FA", dot: "#3B82F6" },
  { id: "proposta_enviada", label: "Proposta enviada", color: "#C084FC", dot: "#A855F7" },
  { id: "negociacao", label: "Negociação", color: "#FBBF24", dot: "#F59E0B" },
  { id: "ativo", label: "Ativo", color: "#34D399", dot: "#10B981" },
  { id: "perdido", label: "Perdido", color: "#F87171", dot: "#EF4444" },
];

const TIPO_LABELS: Record<string, string> = {
  lead: "Lead", prospect: "Prospect", cliente: "Cliente", parceiro: "Parceiro",
};

const TIPO_COLORS: Record<string, string> = {
  lead: "#64748B", prospect: "#3B82F6", cliente: "#10B981", parceiro: "#A855F7",
};

const INTERACAO_ICONS: Record<InteracaoTipo, React.ComponentType<{ size?: number; color?: string }>> = {
  ligacao: PhoneCall,
  reuniao: Calendar,
  email: Mail,
  mensagem: MessageSquare,
};

const INTERACAO_LABELS: Record<InteracaoTipo, string> = {
  ligacao: "Ligação", reuniao: "Reunião", email: "E-mail", mensagem: "Mensagem",
};

function formatCurrency(v: number) {
  return v ? `R$ ${v.toLocaleString("pt-BR")}` : "—";
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────

function ClienteCard({
  cliente,
  onOpen,
  isDragging = false,
}: {
  cliente: Cliente;
  onOpen: () => void;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: cliente.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 999, opacity: 0.92 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      className="rounded-[12px] p-3.5 cursor-pointer group transition-all hover:brightness-110"
      style={{
        ...(style ?? {}),
        background: isDragging ? "#22222E" : "#18181F",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: isDragging ? "0 8px 30px rgba(0,0,0,0.5)" : "0 1px 4px rgba(0,0,0,0.3)",
        userSelect: "none",
      }}
    >
      {/* Name + tipo badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[13px] font-semibold text-[#DEDEE8] leading-snug">{cliente.nome}</p>
        <span
          className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{
            background: `${TIPO_COLORS[cliente.tipo]}18`,
            color: TIPO_COLORS[cliente.tipo],
            border: `1px solid ${TIPO_COLORS[cliente.tipo]}30`,
          }}
        >
          {TIPO_LABELS[cliente.tipo]}
        </span>
      </div>

      {/* Responsável */}
      <div className="flex items-center gap-1.5 mb-2">
        <User size={11} color="#3E3E4E" />
        <span className="text-[11.5px] text-[#5A5A68]">{cliente.responsavel}</span>
      </div>

      {/* Valor + último contato */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#7B93FF]">
          {formatCurrency(cliente.valorPotencial)}
        </span>
        <span className="text-[10.5px] text-[#3E3E4E]">
          {cliente.ultimoContato}
        </span>
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  col,
  clientes,
  onOpen,
}: {
  col: (typeof COLUMNS)[0];
  clientes: Cliente[];
  onOpen: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div className="flex flex-col min-w-[220px] w-[220px] shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <span className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
        <span className="text-[12px] font-semibold" style={{ color: col.color }}>
          {col.label}
        </span>
        <span
          className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", color: "#5A5A68" }}
        >
          {clientes.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-2 min-h-[80px] rounded-[12px] p-1.5 transition-all"
        style={{
          background: isOver ? "rgba(67,97,238,0.06)" : "rgba(255,255,255,0.015)",
          border: isOver ? "1px solid rgba(67,97,238,0.25)" : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {clientes.map((c) => (
          <ClienteCard key={c.id} cliente={c} onOpen={() => onOpen(c.id)} />
        ))}
        {clientes.length === 0 && (
          <div className="flex items-center justify-center h-[60px]">
            <span className="text-[11px] text-[#2E2E3A]">Nenhum cliente</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({
  clientes,
  onOpen,
}: {
  clientes: Cliente[];
  onOpen: (id: string) => void;
}) {
  const colStatus = COLUMNS.reduce<Record<string, (typeof COLUMNS)[0]>>(
    (acc, c) => ({ ...acc, [c.id]: c }),
    {}
  );

  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Head */}
      <div
        className="grid text-[11px] font-semibold text-[#4A4A58] uppercase tracking-wider px-4 py-2.5"
        style={{
          background: "#111118",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          gridTemplateColumns: "1fr 100px 140px 110px 100px 90px",
        }}
      >
        <span>Nome</span>
        <span>Tipo</span>
        <span>Responsável</span>
        <span>Valor potencial</span>
        <span>Status</span>
        <span>Último contato</span>
      </div>

      {clientes.length === 0 && (
        <div className="flex items-center justify-center h-24 text-[12px] text-[#3E3E4E]">
          Nenhum cliente cadastrado
        </div>
      )}

      {clientes.map((c, idx) => {
        const col = colStatus[c.status];
        return (
          <button
            key={c.id}
            onClick={() => onOpen(c.id)}
            className="w-full grid text-left px-4 py-3 transition-colors hover:bg-white/[0.025] group"
            style={{
              gridTemplateColumns: "1fr 100px 140px 110px 100px 90px",
              background: idx % 2 === 0 ? "#0E0E15" : "#0C0C12",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            <span className="text-[13px] font-medium text-[#DEDEE8] flex items-center gap-2">
              {c.nome}
              <ChevronRight size={12} color="#2E2E3A" className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span>
              <span
                className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${TIPO_COLORS[c.tipo]}15`,
                  color: TIPO_COLORS[c.tipo],
                }}
              >
                {TIPO_LABELS[c.tipo]}
              </span>
            </span>
            <span className="text-[12px] text-[#7A7A88]">{c.responsavel}</span>
            <span className="text-[12px] font-semibold text-[#7B93FF]">
              {formatCurrency(c.valorPotencial)}
            </span>
            <span>
              <span
                className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${col?.dot ?? "#64748B"}15`,
                  color: col?.color ?? "#94A3B8",
                  border: `1px solid ${col?.dot ?? "#64748B"}25`,
                }}
              >
                {col?.label ?? c.status}
              </span>
            </span>
            <span className="text-[11.5px] text-[#5A5A68]">{c.ultimoContato}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Cliente Detail ───────────────────────────────────────────────────────────

function ClienteDetail({
  cliente,
  empresaId,
  onBack,
}: {
  cliente: Cliente;
  empresaId: string;
  onBack: () => void;
}) {
  const { addInteracao, moveCliente } = useAppStore();
  const [tipoInteracao, setTipoInteracao] = useState<InteracaoTipo>("ligacao");
  const [anotacao, setAnotacao] = useState("");
  const [dataInteracao, setDataInteracao] = useState(new Date().toISOString().slice(0, 10));
  const [anotacaoFocused, setAnotacaoFocused] = useState(false);

  const col = COLUMNS.find((c) => c.id === cliente.status);
  const interacoesSorted = [...cliente.interacoes].sort((a, b) => b.data.localeCompare(a.data));

  const handleAddInteracao = () => {
    if (!anotacao.trim()) return;
    const interacao: Interacao = {
      id: `int${Date.now()}`,
      tipo: tipoInteracao,
      data: dataInteracao,
      anotacao: anotacao.trim(),
    };
    addInteracao(empresaId, cliente.id, interacao);
    setAnotacao("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Back bar */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12.5px] text-[#5A5A68] hover:text-[#ADADB8] transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar
        </button>
        <span className="text-[#2E2E3A]">/</span>
        <span className="text-[13px] font-semibold text-[#DEDEE8]">{cliente.nome}</span>
        <span
          className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full ml-1"
          style={{
            background: `${col?.dot ?? "#64748B"}18`,
            color: col?.color ?? "#94A3B8",
            border: `1px solid ${col?.dot ?? "#64748B"}25`,
          }}
        >
          {col?.label ?? cliente.status}
        </span>
      </div>

      <div className="flex gap-5 flex-1 min-h-0 overflow-hidden">
        {/* Left: info + interações */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 overflow-y-auto pr-1">

          {/* Info card */}
          <div
            className="rounded-[14px] p-4"
            style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[11px] font-semibold text-[#4A4A58] uppercase tracking-wider mb-3">
              Informações
            </p>
            <div className="grid grid-cols-2 gap-3 text-[12.5px]">
              <InfoRow icon={User} label="Tipo" value={TIPO_LABELS[cliente.tipo]} />
              <InfoRow icon={User} label="Responsável" value={cliente.responsavel} />
              {cliente.telefone && <InfoRow icon={Phone} label="Telefone" value={cliente.telefone} />}
              {cliente.email && <InfoRow icon={Mail} label="E-mail" value={cliente.email} />}
              {cliente.website && <InfoRow icon={Globe} label="Website" value={cliente.website} />}
              <InfoRow icon={DollarSign} label="Valor potencial" value={formatCurrency(cliente.valorPotencial)} />
            </div>
            {cliente.observacoes && (
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-[11px] text-[#4A4A58] mb-1">Observações</p>
                <p className="text-[12.5px] text-[#8A8A98] leading-relaxed">{cliente.observacoes}</p>
              </div>
            )}
          </div>

          {/* Mover no funil */}
          <div
            className="rounded-[14px] p-4"
            style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[11px] font-semibold text-[#4A4A58] uppercase tracking-wider mb-3">
              Mover no funil
            </p>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => moveCliente(empresaId, cliente.id, c.id)}
                  className="text-[11.5px] font-semibold px-3 py-1.5 rounded-[8px] transition-all"
                  style={{
                    background: cliente.status === c.id ? `${c.dot}20` : "rgba(255,255,255,0.03)",
                    color: cliente.status === c.id ? c.color : "#5A5A68",
                    border: cliente.status === c.id ? `1px solid ${c.dot}40` : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Histórico de interações */}
          <div
            className="rounded-[14px] p-4"
            style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[11px] font-semibold text-[#4A4A58] uppercase tracking-wider mb-3">
              Histórico de interações
            </p>

            {interacoesSorted.length === 0 && (
              <p className="text-[12px] text-[#3E3E4E] mb-3">Nenhuma interação registrada.</p>
            )}

            <div className="space-y-2 mb-4">
              {interacoesSorted.map((int) => {
                const Icon = INTERACAO_ICONS[int.tipo];
                return (
                  <div
                    key={int.id}
                    className="flex gap-3 p-3 rounded-[10px]"
                    style={{ background: "#0E0E16", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(67,97,238,0.12)", border: "1px solid rgba(67,97,238,0.2)" }}
                    >
                      <Icon size={13} color="#7B93FF" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11.5px] font-semibold text-[#7B93FF]">
                          {INTERACAO_LABELS[int.tipo]}
                        </span>
                        <span className="text-[11px] text-[#3E3E4E]">{int.data}</span>
                      </div>
                      <p className="text-[12.5px] text-[#8A8A98] leading-relaxed">{int.anotacao}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add interação */}
            <div
              className="pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[11px] font-semibold text-[#4A4A58] mb-2">Registrar interação</p>
              {/* Tipo toggle */}
              <div className="flex gap-2 mb-2">
                {(Object.keys(INTERACAO_LABELS) as InteracaoTipo[]).map((t) => {
                  const Icon = INTERACAO_ICONS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setTipoInteracao(t)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[11.5px] font-semibold transition-all"
                      style={{
                        background: tipoInteracao === t ? "rgba(67,97,238,0.15)" : "rgba(255,255,255,0.03)",
                        color: tipoInteracao === t ? "#7B93FF" : "#4A4A58",
                        border: tipoInteracao === t ? "1px solid rgba(67,97,238,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Icon size={11} />
                      {INTERACAO_LABELS[t]}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={dataInteracao}
                  onChange={(e) => setDataInteracao(e.target.value)}
                  className="px-3 py-2 rounded-[9px] text-[12px] text-[#DEDEE8]"
                  style={{
                    background: "#0C0C14",
                    border: "1px solid rgba(255,255,255,0.07)",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <textarea
                value={anotacao}
                onChange={(e) => setAnotacao(e.target.value)}
                onFocus={() => setAnotacaoFocused(true)}
                onBlur={() => setAnotacaoFocused(false)}
                placeholder="Descreva o que aconteceu nessa interação..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[12.5px] text-[#DEDEE8] placeholder-[#2E2E3A] resize-none mb-2"
                style={{
                  background: "#0C0C14",
                  border: anotacaoFocused ? "1px solid rgba(67,97,238,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
              />
              <button
                onClick={handleAddInteracao}
                disabled={!anotacao.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-[12px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                  boxShadow: "0 2px 10px rgba(67,97,238,0.25)",
                }}
              >
                <Send size={12} />
                Salvar interação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} color="#3E3E4E" className="mt-0.5 shrink-0" />
      <div>
        <p className="text-[10.5px] text-[#4A4A58] mb-0.5">{label}</p>
        <p className="text-[12.5px] text-[#ADADB8]">{value}</p>
      </div>
    </div>
  );
}

// ─── Main ClientesTab ─────────────────────────────────────────────────────────

export function ClientesTab({ empresaId }: { empresaId: string }) {
  const { empresasData, moveCliente } = useAppStore();
  const extra = empresasData[empresaId];
  const clientes: Cliente[] = extra?.clientes ?? [];

  const [viewMode, setViewMode] = useState<"kanban" | "lista">("kanban");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const selectedCliente = clientes.find((c) => c.id === selectedId) ?? null;

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const newStatus = String(over.id) as ClienteStatus;
    const validStatuses = COLUMNS.map((c) => c.id) as string[];
    if (validStatuses.includes(newStatus)) {
      moveCliente(empresaId, String(active.id), newStatus as ClienteStatus);
    }
  };

  const activeDragCliente = clientes.find((c) => c.id === activeId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <p className="text-[15px] font-bold text-[#DEDEE8]">Clientes</p>
          <p className="text-[12px] text-[#4A4A58] mt-0.5">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"} no CRM
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!selectedId && (
            <div
              className="flex items-center gap-0.5 p-1 rounded-[9px]"
              style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => setViewMode("kanban")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all"
                style={{
                  background: viewMode === "kanban" ? "#1C1C28" : "transparent",
                  color: viewMode === "kanban" ? "#CDCDD8" : "#4A4A58",
                  boxShadow: viewMode === "kanban" ? "0 1px 4px rgba(0,0,0,0.3)" : undefined,
                }}
              >
                <LayoutGrid size={13} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("lista")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all"
                style={{
                  background: viewMode === "lista" ? "#1C1C28" : "transparent",
                  color: viewMode === "lista" ? "#CDCDD8" : "#4A4A58",
                  boxShadow: viewMode === "lista" ? "0 1px 4px rgba(0,0,0,0.3)" : undefined,
                }}
              >
                <List size={13} />
                Lista
              </button>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
              boxShadow: "0 2px 12px rgba(67,97,238,0.3)",
            }}
          >
            <Plus size={14} />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedCliente ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto"
            >
              <ClienteDetail
                cliente={selectedCliente}
                empresaId={empresaId}
                onBack={() => setSelectedId(null)}
              />
            </motion.div>
          ) : viewMode === "kanban" ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="flex gap-3 h-full overflow-x-auto pb-2">
                  {COLUMNS.map((col) => (
                    <KanbanColumn
                      key={col.id}
                      col={col}
                      clientes={clientes.filter((c) => c.status === col.id)}
                      onOpen={(id) => setSelectedId(id)}
                    />
                  ))}
                </div>

                <DragOverlay>
                  {activeDragCliente && (
                    <ClienteCard
                      cliente={activeDragCliente}
                      onOpen={() => {}}
                      isDragging
                    />
                  )}
                </DragOverlay>
              </DndContext>
            </motion.div>
          ) : (
            <motion.div
              key="lista"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full overflow-y-auto"
            >
              <ListView clientes={clientes} onOpen={(id) => setSelectedId(id)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {showModal && (
        <NovoClienteModal empresaId={empresaId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
