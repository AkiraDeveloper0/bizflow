"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Globe, Hash, Phone, MapPin, User,
  FileText, Key, Lightbulb, TrendingUp, Plus, Trash2, Eye, EyeOff,
  Copy, Check, Edit2, Save, X, ChevronUp, ChevronDown, ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Nota, EmpresaLogin, Ideia, IdeiaStatus, FaturamentoEntry, EmpresaExtra } from "@/types";
import { ClientesTab } from "@/components/pages/ClientesTab";

// ─── Shared Helpers ──────────────────────────────────────────────────────────

const NOTE_COLORS = ["#4361EE", "#7C3AED", "#059669", "#DB2777", "#D97706", "#0EA5E9"];

const IDEIA_STATUS_CONFIG: Record<IdeiaStatus, { label: string; color: string; bg: string }> = {
  nova: { label: "Nova", color: "#9CA3AF", bg: "rgba(156,163,175,0.12)" },
  em_avaliacao: { label: "Em avaliação", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  aprovada: { label: "Aprovada", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  descartada: { label: "Descartada", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

function InputField({
  label, value, onChange, placeholder, disabled, type = "text",
}: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10.5px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || label}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A] disabled:text-[#5A5A68]"
        style={{
          background: disabled ? "rgba(255,255,255,0.02)" : "#0C0C14",
          border: disabled ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(255,255,255,0.08)",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = "rgba(67,97,238,0.4)"; }}
        onBlur={(e) => { if (!disabled) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

// ─── Tab: Informações ────────────────────────────────────────────────────────

function InfoTab({ empresaId }: { empresaId: string }) {
  const { empresas, empresasData, updateEmpresa, updateEmpresaExtra, projects } = useAppStore();
  const empresa = empresas.find((e) => e.id === empresaId)!;
  const extra: EmpresaExtra = empresasData[empresaId] ?? {
    website: "", cnpj: "", telefone: "", endereco: "",
    notas: [], logins: [], ideias: [], faturamento: [],
  };
  const [editing, setEditing] = useState(false);

  // Local state for editing
  const [form, setForm] = useState({
    name: empresa.name, description: empresa.description,
    segment: empresa.segment, website: extra.website,
    cnpj: extra.cnpj, telefone: extra.telefone, endereco: extra.endereco,
  });

  const vinculatedProjects = projects.filter((p) => p.empresaId === empresaId);

  const STATUS_LABELS = {
    ativa: { label: "Ativa", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
    inativa: { label: "Inativa", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
    em_formacao: { label: "Em formação", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  };
  const statusCfg = STATUS_LABELS[empresa.status];

  const handleSave = () => {
    updateEmpresa(empresaId, { name: form.name, description: form.description, segment: form.segment });
    updateEmpresaExtra(empresaId, { website: form.website, cnpj: form.cnpj, telefone: form.telefone, endereco: form.endereco });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-[#4A4A58]">Informações gerais da empresa</p>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#5A5A68] hover:bg-white/[0.04] transition-all">
              <X size={13} /> Cancelar
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
              <Save size={13} /> Salvar
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#5A5A68] hover:text-[#ADADB8] hover:bg-white/[0.04] transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <Edit2 size={12} /> Editar
          </button>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} disabled={!editing} />
        <InputField label="Segmento" value={form.segment} onChange={(v) => setForm({ ...form, segment: v })} disabled={!editing} />
        <div className="col-span-2">
          <label className="block text-[10.5px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={!editing}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-[9px] text-[13px] text-[#DEDEE8] disabled:text-[#5A5A68] resize-none"
            style={{
              background: editing ? "#0C0C14" : "rgba(255,255,255,0.02)",
              border: editing ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)",
              outline: "none",
            }}
          />
        </div>
        <InputField label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://" disabled={!editing} />
        <InputField label="CNPJ" value={form.cnpj} onChange={(v) => setForm({ ...form, cnpj: v })} placeholder="00.000.000/0000-00" disabled={!editing} />
        <InputField label="Telefone" value={form.telefone} onChange={(v) => setForm({ ...form, telefone: v })} placeholder="(00) 0 0000-0000" disabled={!editing} />
        <InputField label="Endereço" value={form.endereco} onChange={(v) => setForm({ ...form, endereco: v })} placeholder="Rua, número - Cidade, UF" disabled={!editing} />
      </div>

      {/* Status + Responsible */}
      <div
        className="flex items-center gap-6 p-4 rounded-[12px]"
        style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: empresa.responsible.color }}>
            {empresa.responsible.initials}
          </div>
          <div>
            <p className="text-[11px] text-[#4A4A58]">Responsável</p>
            <p className="text-[13px] font-semibold text-[#DEDEE8]">{empresa.responsible.name}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-white/[0.06]" />
        <div>
          <p className="text-[11px] text-[#4A4A58] mb-1">Status</p>
          <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-[6px]"
            style={{ background: statusCfg.bg, color: statusCfg.color }}>
            {statusCfg.label}
          </span>
        </div>
        <div className="w-px h-8 bg-white/[0.06]" />
        <div>
          <p className="text-[11px] text-[#4A4A58]">Projetos</p>
          <p className="text-[13px] font-semibold text-[#DEDEE8]">{empresa.projectCount}</p>
        </div>
        {extra.website && (
          <>
            <div className="w-px h-8 bg-white/[0.06]" />
            <a href={extra.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-[#4361EE] hover:underline">
              <ExternalLink size={12} /> Abrir site
            </a>
          </>
        )}
      </div>

      {/* Projects list */}
      {vinculatedProjects.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-[#4A4A58] uppercase tracking-wider mb-3">Projetos vinculados</p>
          <div className="space-y-2">
            {vinculatedProjects.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-[10px]"
                style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-lg">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#DEDEE8]">{p.name}</p>
                  <p className="text-[11px] text-[#3A3A48] truncate">{p.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
                  </div>
                  <span className="text-[11px] text-[#4A4A58]">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Notas ───────────────────────────────────────────────────────────────

function NotasTab({ empresaId }: { empresaId: string }) {
  const { empresasData, addNota, removeNota } = useAppStore();
  const extra = empresasData[empresaId] ?? { notas: [] };
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);

  const handleAdd = () => {
    if (!title.trim()) return;
    addNota(empresaId, {
      id: `nota-${Date.now()}`, title: title.trim(), content: content.trim(),
      createdAt: new Date().toISOString().split("T")[0], color,
    });
    setTitle(""); setContent(""); setColor(NOTE_COLORS[0]); setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-[#4A4A58]">{extra.notas?.length || 0} notas</p>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
          <Plus size={13} /> Nova Nota
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-4 rounded-[14px]"
            style={{ background: "#111118", border: "1px solid rgba(67,97,238,0.2)" }}>
            <div className="space-y-3">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da nota..." autoFocus
                className="w-full px-3 py-2 rounded-[8px] text-[13px] text-[#DEDEE8] placeholder-[#3A3A48]"
                style={{ background: "#0C0C14", border: "1px solid rgba(255,255,255,0.07)", outline: "none" }} />
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Conteúdo da nota..." rows={3}
                className="w-full px-3 py-2 rounded-[8px] text-[13px] text-[#DEDEE8] placeholder-[#3A3A48] resize-none"
                style={{ background: "#0C0C14", border: "1px solid rgba(255,255,255,0.07)", outline: "none" }} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#4A4A58]">Cor:</span>
                  {NOTE_COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className="w-5 h-5 rounded-full transition-transform hover:scale-110 relative"
                      style={{ background: c }}>
                      {color === c && <Check size={10} color="white" className="absolute inset-0 m-auto" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 rounded-[7px] text-[12px] text-[#5A5A68] hover:bg-white/[0.04] transition-all">
                    Cancelar
                  </button>
                  <button onClick={handleAdd} disabled={!title.trim()}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-[7px] text-[12px] font-semibold text-white disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
                    <Plus size={12} /> Salvar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes grid */}
      {(extra.notas?.length || 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-[12px] flex items-center justify-center"
            style={{ background: "rgba(67,97,238,0.08)", border: "1px solid rgba(67,97,238,0.15)" }}>
            <FileText size={20} color="#4361EE" />
          </div>
          <p className="text-[13px] font-semibold text-[#3A3A48]">Nenhuma nota ainda</p>
          <p className="text-[12px] text-[#2A2A36]">Crie notas para salvar informações importantes</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {(extra.notas || []).map((nota: Nota, i: number) => (
            <motion.div key={nota.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-[13px] p-4 relative"
              style={{ background: "#111118", border: `1px solid ${nota.color}25`, borderLeft: `3px solid ${nota.color}` }}>
              <button onClick={() => removeNota(empresaId, nota.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-[6px] text-[#3A3A48] hover:text-[#EF4444] hover:bg-white/[0.06] transition-all">
                <Trash2 size={12} />
              </button>
              <p className="text-[13px] font-bold text-[#DEDEE8] mb-2 pr-6">{nota.title}</p>
              <p className="text-[12px] text-[#5A5A68] leading-relaxed line-clamp-4">{nota.content}</p>
              <p className="text-[10px] text-[#3A3A48] mt-3">{nota.createdAt}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Logins ──────────────────────────────────────────────────────────────

function LoginsTab({ empresaId }: { empresaId: string }) {
  const { empresasData, addLogin, removeLogin } = useAppStore();
  const extra = empresasData[empresaId] ?? { logins: [] };
  const [showForm, setShowForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({ service: "", username: "", password: "", url: "" });

  const togglePassword = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = () => {
    if (!form.service.trim()) return;
    addLogin(empresaId, { id: `login-${Date.now()}`, ...form });
    setForm({ service: "", username: "", password: "", url: "" });
    setShowForm(false);
  };

  const getServiceInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} color="#F97316" />
          <p className="text-[11.5px] text-[#5A5A68]">Credenciais armazenadas localmente no seu dispositivo</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
          <Plus size={13} /> Novo Login
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-4 rounded-[14px]"
            style={{ background: "#111118", border: "1px solid rgba(67,97,238,0.2)" }}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputField label="Serviço" value={form.service} onChange={(v) => setForm({ ...form, service: v })} placeholder="Ex: AWS, GitHub..." />
              <InputField label="Usuário / Email" value={form.username} onChange={(v) => setForm({ ...form, username: v })} placeholder="usuario@email.com" />
              <InputField label="Senha" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" type="password" />
              <InputField label="URL" value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-[7px] text-[12px] text-[#5A5A68] hover:bg-white/[0.04] transition-all">Cancelar</button>
              <button onClick={handleAdd} disabled={!form.service.trim()}
                className="flex items-center gap-1 px-4 py-1.5 rounded-[7px] text-[12px] font-semibold text-white disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
                <Plus size={12} /> Salvar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logins list */}
      {(extra.logins?.length || 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-[12px] flex items-center justify-center"
            style={{ background: "rgba(67,97,238,0.08)", border: "1px solid rgba(67,97,238,0.15)" }}>
            <Key size={20} color="#4361EE" />
          </div>
          <p className="text-[13px] font-semibold text-[#3A3A48]">Nenhum login salvo</p>
          <p className="text-[12px] text-[#2A2A36]">Salve credenciais importantes desta empresa</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(extra.logins || []).map((login: EmpresaLogin, i: number) => (
            <motion.div key={login.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-center gap-4 px-5 py-4 rounded-[12px]"
              style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Service icon */}
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #4361EE80, #7C3AED80)" }}>
                {getServiceInitials(login.service)}
              </div>

              {/* Service + URL */}
              <div className="w-[160px] shrink-0">
                <p className="text-[13px] font-semibold text-[#DEDEE8]">{login.service}</p>
                {login.url && (
                  <a href={login.url} target="_blank" rel="noopener noreferrer"
                    className="text-[10.5px] text-[#4361EE] hover:underline truncate block">
                    {login.url.replace("https://", "")}
                  </a>
                )}
              </div>

              {/* Username */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#4A4A58]">Usuário</p>
                <p className="text-[12.5px] text-[#C8C8D8] truncate">{login.username}</p>
              </div>

              {/* Password */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12.5px] text-[#C8C8D8] font-mono w-28 text-right">
                  {visiblePasswords.has(login.id) ? login.password : "••••••••••••"}
                </span>
                <button onClick={() => togglePassword(login.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-[7px] text-[#4A4A58] hover:text-[#ADADB8] hover:bg-white/[0.06] transition-all">
                  {visiblePasswords.has(login.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={() => copyToClipboard(login.password, login.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-[7px] text-[#4A4A58] hover:text-[#22C55E] hover:bg-white/[0.06] transition-all">
                  {copiedId === login.id ? <Check size={13} color="#22C55E" /> : <Copy size={13} />}
                </button>
                <button onClick={() => removeLogin(empresaId, login.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-[7px] text-[#4A4A58] hover:text-[#EF4444] hover:bg-white/[0.06] transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Ideias ──────────────────────────────────────────────────────────────

function IdeiasTab({ empresaId }: { empresaId: string }) {
  const { empresasData, addIdeia, updateIdeia, removeIdeia } = useAppStore();
  const extra = empresasData[empresaId] ?? { ideias: [] };
  const [filterStatus, setFilterStatus] = useState<IdeiaStatus | "todas">("todas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "nova" as IdeiaStatus });

  const filteredIdeias = (extra.ideias || []).filter(
    (i: Ideia) => filterStatus === "todas" || i.status === filterStatus
  );

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addIdeia(empresaId, {
      id: `ideia-${Date.now()}`, title: form.title.trim(),
      description: form.description.trim(), votes: 0,
      createdAt: new Date().toISOString().split("T")[0], status: form.status,
    });
    setForm({ title: "", description: "", status: "nova" }); setShowForm(false);
  };

  const FILTER_TABS = [
    { id: "todas" as const, label: "Todas" },
    { id: "nova" as const, label: "Novas" },
    { id: "em_avaliacao" as const, label: "Em avaliação" },
    { id: "aprovada" as const, label: "Aprovadas" },
    { id: "descartada" as const, label: "Descartadas" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {FILTER_TABS.map((t) => (
            <button key={t.id} onClick={() => setFilterStatus(t.id)}
              className="px-3 py-1.5 rounded-[7px] text-[12px] font-medium transition-all"
              style={{
                color: filterStatus === t.id ? "#EDEDED" : "#4A4A58",
                background: filterStatus === t.id ? "#1E1E28" : "transparent",
                border: filterStatus === t.id ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
          <Plus size={13} /> Nova Ideia
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-4 rounded-[14px]"
            style={{ background: "#111118", border: "1px solid rgba(67,97,238,0.2)" }}>
            <div className="space-y-3">
              <InputField label="Título" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Descreva sua ideia..." />
              <div>
                <label className="block text-[10.5px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">Detalhes</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Explique com mais detalhes..." rows={2}
                  className="w-full px-3 py-2 rounded-[8px] text-[13px] text-[#DEDEE8] placeholder-[#3A3A48] resize-none"
                  style={{ background: "#0C0C14", border: "1px solid rgba(255,255,255,0.07)", outline: "none" }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(["nova", "em_avaliacao", "aprovada"] as IdeiaStatus[]).map((s) => {
                    const cfg = IDEIA_STATUS_CONFIG[s];
                    return (
                      <button key={s} onClick={() => setForm({ ...form, status: s })}
                        className="px-2.5 py-1 rounded-[7px] text-[11px] font-semibold transition-all"
                        style={{
                          background: form.status === s ? cfg.bg : "rgba(255,255,255,0.04)",
                          color: form.status === s ? cfg.color : "#4A4A58",
                          border: `1px solid ${form.status === s ? cfg.color + "40" : "rgba(255,255,255,0.06)"}`,
                        }}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 rounded-[7px] text-[12px] text-[#5A5A68] hover:bg-white/[0.04] transition-all">Cancelar</button>
                  <button onClick={handleAdd} disabled={!form.title.trim()}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-[7px] text-[12px] font-semibold text-white disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
                    <Plus size={12} /> Salvar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredIdeias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-[12px] flex items-center justify-center"
            style={{ background: "rgba(67,97,238,0.08)", border: "1px solid rgba(67,97,238,0.15)" }}>
            <Lightbulb size={20} color="#4361EE" />
          </div>
          <p className="text-[13px] font-semibold text-[#3A3A48]">Nenhuma ideia ainda</p>
          <p className="text-[12px] text-[#2A2A36]">Registre ideias e acompanhe sua evolução</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIdeias.map((ideia: Ideia, i: number) => {
            const cfg = IDEIA_STATUS_CONFIG[ideia.status];
            return (
              <motion.div key={ideia.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group flex items-start gap-4 px-5 py-4 rounded-[12px]"
                style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Votes */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button onClick={() => updateIdeia(empresaId, ideia.id, { votes: ideia.votes + 1 })}
                    className="w-6 h-6 flex items-center justify-center rounded-[5px] text-[#4A4A58] hover:text-[#22C55E] hover:bg-white/[0.06] transition-all">
                    <ChevronUp size={13} />
                  </button>
                  <span className="text-[12px] font-bold text-[#DEDEE8]">{ideia.votes}</span>
                  <button onClick={() => updateIdeia(empresaId, ideia.id, { votes: Math.max(0, ideia.votes - 1) })}
                    className="w-6 h-6 flex items-center justify-center rounded-[5px] text-[#4A4A58] hover:text-[#EF4444] hover:bg-white/[0.06] transition-all">
                    <ChevronDown size={13} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#DEDEE8]">{ideia.title}</p>
                  {ideia.description && (
                    <p className="text-[12px] text-[#5A5A68] mt-1 leading-relaxed">{ideia.description}</p>
                  )}
                  <p className="text-[10px] text-[#2E2E3A] mt-2">{ideia.createdAt}</p>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <select value={ideia.status}
                    onChange={(e) => updateIdeia(empresaId, ideia.id, { status: e.target.value as IdeiaStatus })}
                    className="text-[11px] font-semibold px-2 py-1 rounded-[6px] appearance-none cursor-pointer"
                    style={{ background: cfg.bg, color: cfg.color, border: "none", outline: "none" }}>
                    {Object.entries(IDEIA_STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k} style={{ background: "#111118" }}>{v.label}</option>
                    ))}
                  </select>
                  <button onClick={() => removeIdeia(empresaId, ideia.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-[7px] text-[#4A4A58] hover:text-[#EF4444] hover:bg-white/[0.06] transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Faturamento ────────────────────────────────────────────────────────

function FaturamentoTab({ empresaId }: { empresaId: string }) {
  const { empresasData, addFaturamento, removeFaturamento } = useAppStore();
  const extra = empresasData[empresaId] ?? { faturamento: [] };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ month: "", receita: "", despesas: "", descricao: "" });

  const entries: FaturamentoEntry[] = (extra.faturamento || []).sort((a, b) => a.month.localeCompare(b.month));
  const totalReceita = entries.reduce((s, e) => s + e.receita, 0);
  const totalDespesas = entries.reduce((s, e) => s + e.despesas, 0);
  const resultado = totalReceita - totalDespesas;

  const maxVal = Math.max(...entries.map((e) => Math.max(e.receita, e.despesas)), 1);

  const handleAdd = () => {
    if (!form.month || !form.receita) return;
    addFaturamento(empresaId, {
      id: `fat-${Date.now()}`, month: form.month,
      receita: Number(form.receita), despesas: Number(form.despesas) || 0,
      descricao: form.descricao,
    });
    setForm({ month: "", receita: "", despesas: "", descricao: "" }); setShowForm(false);
  };

  const fmt = (v: number) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const monthLabel = (m: string) => {
    const [y, mo] = m.split("-");
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${months[parseInt(mo) - 1]} ${y}`;
  };

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Receita", value: totalReceita, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
          { label: "Total Despesas", value: totalDespesas, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
          { label: "Resultado", value: resultado, color: resultado >= 0 ? "#22C55E" : "#EF4444", bg: resultado >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" },
        ].map((card) => (
          <div key={card.label} className="p-4 rounded-[12px]"
            style={{ background: card.bg, border: `1px solid ${card.color}25` }}>
            <p className="text-[11px] text-[#5A5A68] mb-1">{card.label}</p>
            <p className="text-[18px] font-bold" style={{ color: card.color }}>{fmt(card.value)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] text-[#4A4A58]">{entries.length} {entries.length === 1 ? "mês" : "meses"} registrados</p>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
          <Plus size={13} /> Adicionar Mês
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-4 rounded-[14px]"
            style={{ background: "#111118", border: "1px solid rgba(67,97,238,0.2)" }}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10.5px] font-semibold text-[#5A5A68] uppercase tracking-wider mb-1.5">Mês *</label>
                <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[8px] text-[13px] text-[#DEDEE8]"
                  style={{ background: "#0C0C14", border: "1px solid rgba(255,255,255,0.07)", outline: "none", colorScheme: "dark" }} />
              </div>
              <InputField label="Receita (R$)" value={form.receita} onChange={(v) => setForm({ ...form, receita: v })} placeholder="0" type="number" />
              <InputField label="Despesas (R$)" value={form.despesas} onChange={(v) => setForm({ ...form, despesas: v })} placeholder="0" type="number" />
              <InputField label="Descrição" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} placeholder="Observações..." />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-[7px] text-[12px] text-[#5A5A68] hover:bg-white/[0.04] transition-all">Cancelar</button>
              <button onClick={handleAdd} disabled={!form.month || !form.receita}
                className="flex items-center gap-1 px-4 py-1.5 rounded-[7px] text-[12px] font-semibold text-white disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}>
                <Plus size={12} /> Salvar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-[12px] flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <TrendingUp size={20} color="#22C55E" />
          </div>
          <p className="text-[13px] font-semibold text-[#3A3A48]">Nenhum dado de faturamento</p>
          <p className="text-[12px] text-[#2A2A36]">Adicione dados mensais de receita e despesas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => {
            const res = entry.receita - entry.despesas;
            const recPct = (entry.receita / maxVal) * 100;
            const despPct = (entry.despesas / maxVal) * 100;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group px-5 py-4 rounded-[12px]"
                style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-bold text-[#DEDEE8]">{monthLabel(entry.month)}</p>
                    {entry.descricao && <p className="text-[11px] text-[#4A4A58]">{entry.descricao}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-[#4A4A58]">Receita</p>
                      <p className="text-[13px] font-semibold text-[#22C55E]">{fmt(entry.receita)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#4A4A58]">Despesas</p>
                      <p className="text-[13px] font-semibold text-[#EF4444]">{fmt(entry.despesas)}</p>
                    </div>
                    <div className="text-right w-24">
                      <p className="text-[10px] text-[#4A4A58]">Resultado</p>
                      <p className="text-[13px] font-bold" style={{ color: res >= 0 ? "#22C55E" : "#EF4444" }}>
                        {res >= 0 ? "+" : ""}{fmt(res)}
                      </p>
                    </div>
                    <button onClick={() => removeFaturamento(empresaId, entry.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-[7px] text-[#4A4A58] hover:text-[#EF4444] hover:bg-white/[0.06] transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {/* Mini bars */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#22C55E] w-14">Receita</span>
                    <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${recPct}%`, background: "#22C55E" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#EF4444] w-14">Despesas</span>
                    <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${despPct}%`, background: "#EF4444" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type TabId = "informacoes" | "notas" | "logins" | "ideias" | "faturamento" | "clientes";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "informacoes", label: "Informações", icon: <Building2 size={13} /> },
  { id: "notas", label: "Notas", icon: <FileText size={13} /> },
  { id: "logins", label: "Logins", icon: <Key size={13} /> },
  { id: "ideias", label: "Ideias", icon: <Lightbulb size={13} /> },
  { id: "faturamento", label: "Faturamento", icon: <TrendingUp size={13} /> },
  { id: "clientes", label: "Clientes", icon: <User size={13} /> },
];

export function EmpresaDetailPage() {
  const { empresas, activeEmpresaId, setActivePage, empresasData } = useAppStore();
  const empresa = empresas.find((e) => e.id === activeEmpresaId);
  const [activeTab, setActiveTab] = useState<TabId>("informacoes");

  if (!empresa) {
    setActivePage("empresas");
    return null;
  }

  const extra = empresasData[empresa.id];
  const unreadCounts = {
    notas: extra?.notas?.length || 0,
    logins: extra?.logins?.length || 0,
    ideias: extra?.ideias?.length || 0,
    faturamento: extra?.faturamento?.length || 0,
    clientes: extra?.clientes?.length || 0,
  };

  const STATUS_LABELS = {
    ativa: { label: "Ativa", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
    inativa: { label: "Inativa", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
    em_formacao: { label: "Em formação", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  };
  const statusCfg = STATUS_LABELS[empresa.status];

  return (
    <div className="h-full flex flex-col">
      {/* ─── Header ─── */}
      <div className="shrink-0 px-7 pt-5 pb-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActivePage("empresas")}
            className="w-6 h-6 flex items-center justify-center rounded-[6px] text-[#3A3A48] hover:text-[#8A8A98] hover:bg-white/[0.04] transition-all">
            <ArrowLeft size={13} />
          </button>
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#3A3A48]">
            <button onClick={() => setActivePage("empresas")} className="hover:text-[#6A6A78] transition-colors">
              Empresas
            </button>
            <span>›</span>
            <span className="text-[#7A7A88] font-medium">{empresa.name}</span>
          </div>
        </div>

        {/* Company header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-[13px] flex items-center justify-center text-[16px] font-bold text-white shrink-0"
            style={{
              background: `linear-gradient(135deg, ${empresa.color}CC 0%, ${empresa.color}88 100%)`,
              boxShadow: `0 6px 20px ${empresa.color}30`,
            }}>
            {empresa.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-[#EDEDED] tracking-[-0.025em]">{empresa.name}</h1>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px]"
                style={{ background: statusCfg.bg, color: statusCfg.color }}>
                {statusCfg.label}
              </span>
            </div>
            <p className="text-[12px] text-[#4A4A58] mt-0.5">{empresa.segment} · {empresa.projectCount} projetos</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0.5">
          {TABS.map((tab) => {
            const count = unreadCounts[tab.id as keyof typeof unreadCounts] || 0;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-3.5 py-[9px] text-[12px] font-medium transition-colors"
                style={{ color: isActive ? "#DEDEE8" : "#44444E" }}>
                {tab.icon}
                {tab.label}
                {count > 0 && tab.id !== "informacoes" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: isActive ? "#4361EE" : "rgba(255,255,255,0.08)", color: isActive ? "white" : "#5A5A68" }}>
                    {count}
                  </span>
                )}
                {isActive && (
                  <motion.div layoutId="empresa-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                    style={{ background: "#4361EE" }}
                    transition={{ type: "spring", stiffness: 500, damping: 45 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className={`flex-1 min-h-0 px-7 py-6 ${activeTab === "clientes" ? "overflow-hidden flex flex-col" : "overflow-auto"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            className={activeTab === "clientes" ? "flex-1 min-h-0 overflow-hidden flex flex-col" : undefined}>
            {activeTab === "informacoes" && <InfoTab empresaId={empresa.id} />}
            {activeTab === "notas" && <NotasTab empresaId={empresa.id} />}
            {activeTab === "logins" && <LoginsTab empresaId={empresa.id} />}
            {activeTab === "ideias" && <IdeiasTab empresaId={empresa.id} />}
            {activeTab === "faturamento" && <FaturamentoTab empresaId={empresa.id} />}
            {activeTab === "clientes" && <ClientesTab empresaId={empresa.id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
