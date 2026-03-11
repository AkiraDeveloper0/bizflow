"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Building2,
  Palette,
  Bell,
  Plug,
  ChevronRight,
  Check,
  Moon,
  Monitor,
  Sun,
  Shield,
  Trash2,
  Users,
  Plus,
  X,
  Pencil,
  Database,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Section = "perfil" | "workspace" | "aparencia" | "notificacoes" | "integracoes" | "equipe" | "dados";

const SECTIONS: { id: Section; label: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "dados", label: "Dados", icon: Database },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "integracoes", label: "Integrações", icon: Plug },
];

const ACCENT_COLORS = [
  { label: "Azul", value: "#4361EE" },
  { label: "Roxo", value: "#7C3AED" },
  { label: "Verde", value: "#059669" },
  { label: "Rosa", value: "#DB2777" },
  { label: "Laranja", value: "#D97706" },
  { label: "Vermelho", value: "#EF4444" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all"
      style={{ background: checked ? "#4361EE" : "#2A2A36" }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 700, damping: 35 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div>
        <p className="text-[13px] font-medium text-[#CACAD8]">{label}</p>
        {description && (
          <p className="text-[11px] text-[#3A3A50] mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="mb-4">
      {title && (
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#3A3A50] mb-2 px-1">
          {title}
        </p>
      )}
      <div
        className="rounded-[12px] overflow-hidden"
        style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.055)" }}
      >
        {children}
      </div>
    </div>
  );
}

function PerfilSection() {
  const { empresas } = useAppStore();
  const [name, setName] = useState("Rafael Costa");
  const [email, setEmail] = useState("rafael@bizflow.com.br");
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionCard title="Informações pessoais">
        <div className="p-4 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}
            >
              RC
            </div>
            <div>
              <button
                className="text-[12px] font-semibold text-[#4361EE] hover:text-[#5A74F0] transition-colors"
              >
                Alterar foto
              </button>
              <p className="text-[11px] text-[#3A3A50] mt-0.5">JPG, PNG até 2MB</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[11px] font-medium text-[#5A5A70] mb-1.5">Nome completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-[8px] text-[13px] text-[#DEDEE8] outline-none transition-all"
              style={{
                background: "#1A1A22",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(67,97,238,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-[#5A5A70] mb-1.5">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-3 py-2.5 rounded-[8px] text-[13px] text-[#DEDEE8] outline-none transition-all"
              style={{
                background: "#1A1A22",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(67,97,238,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>

          <button
            onClick={save}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
            style={{
              background: saved ? "#059669" : "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
              boxShadow: "0 2px 10px rgba(67,97,238,0.25)",
            }}
          >
            {saved ? <><Check size={13} /> Salvo</> : "Salvar alterações"}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Segurança">
        <SettingRow label="Alterar senha" description="Última alteração: nunca">
          <button className="text-[12px] font-semibold text-[#4361EE] hover:text-[#5A74F0] transition-colors">
            Alterar
          </button>
        </SettingRow>
        <SettingRow label="Autenticação em 2 fatores" description="Adiciona uma camada extra de segurança">
          <Toggle checked={false} onChange={() => {}} />
        </SettingRow>
      </SectionCard>

      <SectionCard title="Zona de perigo">
        <div className="p-4">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-[12px] font-semibold transition-all hover:brightness-110"
            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <Trash2 size={13} />
            Excluir conta
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function WorkspaceSection() {
  const { empresas } = useAppStore();
  const [wsName, setWsName] = useState("Organização Empresarial");
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionCard title="Informações do workspace">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[#5A5A70] mb-1.5">Nome do workspace</label>
            <input
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-[8px] text-[13px] text-[#DEDEE8] outline-none transition-all"
              style={{ background: "#1A1A22", border: "1px solid rgba(255,255,255,0.07)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(67,97,238,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>
          <button
            onClick={save}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12.5px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
            style={{
              background: saved ? "#059669" : "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
              boxShadow: "0 2px 10px rgba(67,97,238,0.25)",
            }}
          >
            {saved ? <><Check size={13} /> Salvo</> : "Salvar"}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Estatísticas">
        <div className="p-4 grid grid-cols-3 gap-3">
          {[
            { label: "Empresas", value: empresas.length },
            { label: "Membros", value: 5 },
            { label: "Projetos ativos", value: 3 },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-[9px]" style={{ background: "#1A1A22" }}>
              <p className="text-[22px] font-bold text-[#4361EE]">{s.value}</p>
              <p className="text-[10.5px] text-[#3A3A50] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Permissões">
        <SettingRow label="Convidar membros" description="Permitir que membros convidem outros">
          <Toggle checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Criar projetos" description="Qualquer membro pode criar projetos">
          <Toggle checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Excluir tasks" description="Somente admins podem excluir tasks">
          <Toggle checked={false} onChange={() => {}} />
        </SettingRow>
      </SectionCard>
    </div>
  );
}

function AparenciaSection() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent] = useState("#4361EE");
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div>
      <SectionCard title="Tema">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "dark", label: "Escuro", icon: Moon },
              { id: "light", label: "Claro", icon: Sun },
              { id: "system", label: "Sistema", icon: Monitor },
            ] as const).map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-[10px] transition-all"
                  style={{
                    background: isActive ? "rgba(67,97,238,0.1)" : "#1A1A22",
                    border: isActive ? "1px solid rgba(67,97,238,0.35)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Icon size={18} color={isActive ? "#4361EE" : "#4A4A60"} />
                  <span className="text-[11.5px] font-medium" style={{ color: isActive ? "#4361EE" : "#5A5A70" }}>
                    {t.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4361EE]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Cor de destaque">
        <div className="p-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setAccent(c.value)}
                title={c.label}
                className="w-8 h-8 rounded-full transition-all hover:scale-110 relative flex items-center justify-center"
                style={{
                  background: c.value,
                  boxShadow: accent === c.value ? `0 0 0 3px rgba(255,255,255,0.12), 0 0 0 5px ${c.value}` : "none",
                }}
              >
                {accent === c.value && <Check size={13} color="white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Interface">
        <SettingRow label="Modo compacto" description="Reduz espaçamento entre elementos">
          <Toggle checked={compactMode} onChange={setCompactMode} />
        </SettingRow>
        <SettingRow label="Animações" description="Ativa transições e micro-animações">
          <Toggle checked={animations} onChange={setAnimations} />
        </SettingRow>
      </SectionCard>
    </div>
  );
}

function NotificacoesSection() {
  const [notifs, setNotifs] = useState({
    taskUpdates: true,
    projectChanges: true,
    mentions: true,
    deadlines: true,
    weeklyReport: false,
    emailDigest: false,
  });

  const toggle = (key: keyof typeof notifs) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <SectionCard title="Notificações no app">
        <SettingRow label="Atualizações de tasks" description="Quando uma task é atualizada ou concluída">
          <Toggle checked={notifs.taskUpdates} onChange={() => toggle("taskUpdates")} />
        </SettingRow>
        <SettingRow label="Mudanças em projetos" description="Novos membros, status e prazos">
          <Toggle checked={notifs.projectChanges} onChange={() => toggle("projectChanges")} />
        </SettingRow>
        <SettingRow label="Menções" description="Quando alguém te menciona em um comentário">
          <Toggle checked={notifs.mentions} onChange={() => toggle("mentions")} />
        </SettingRow>
        <SettingRow label="Prazos próximos" description="Alerta 2 dias antes do vencimento">
          <Toggle checked={notifs.deadlines} onChange={() => toggle("deadlines")} />
        </SettingRow>
      </SectionCard>

      <SectionCard title="Notificações por e-mail">
        <SettingRow label="Relatório semanal" description="Resumo de atividades toda segunda-feira">
          <Toggle checked={notifs.weeklyReport} onChange={() => toggle("weeklyReport")} />
        </SettingRow>
        <SettingRow label="Digest diário" description="Resumo das atividades do dia">
          <Toggle checked={notifs.emailDigest} onChange={() => toggle("emailDigest")} />
        </SettingRow>
      </SectionCard>
    </div>
  );
}

function IntegracoesSection() {
  const integrations = [
    { name: "GitHub", icon: "🐙", description: "Vincule pull requests e issues a tasks", connected: false, color: "#24292E" },
    { name: "Slack", icon: "💬", description: "Receba notificações no seu canal Slack", connected: false, color: "#4A154B" },
    { name: "Google Calendar", icon: "📅", description: "Sincronize prazos com seu calendário", connected: false, color: "#4285F4" },
    { name: "Notion", icon: "📝", description: "Importe documentos e wikis do Notion", connected: false, color: "#000000" },
    { name: "Zapier", icon: "⚡", description: "Automatize workflows com 5000+ apps", connected: false, color: "#FF4A00" },
    { name: "Supabase", icon: "🗄️", description: "Conecte ao banco de dados em tempo real", connected: false, color: "#3ECF8E" },
  ];

  return (
    <div>
      <SectionCard title="Integrações disponíveis">
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {integrations.map((integ) => (
            <div key={integ.name} className="flex items-center gap-3 px-4 py-3.5">
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center text-lg shrink-0"
                style={{ background: integ.color + "22", border: `1px solid ${integ.color}30` }}
              >
                {integ.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#CACAD8]">{integ.name}</p>
                <p className="text-[11px] text-[#3A3A50] truncate">{integ.description}</p>
              </div>
              <button
                className="shrink-0 px-3 py-1.5 rounded-[7px] text-[11.5px] font-semibold transition-all hover:brightness-110"
                style={{
                  background: integ.connected ? "rgba(34,197,94,0.1)" : "rgba(67,97,238,0.1)",
                  color: integ.connected ? "#22C55E" : "#4361EE",
                  border: integ.connected ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(67,97,238,0.2)",
                }}
              >
                {integ.connected ? "Conectado" : "Conectar"}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

const PRESET_COLORS = ["#4361EE","#7C3AED","#059669","#DB2777","#D97706","#0EA5E9"];

function EquipeSection() {
  const { members, addMember, removeMember, updateMember } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Form state for new / edit
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [formInitials, setFormInitials] = useState("");

  function openAdd() {
    setFormName("");
    setFormColor(PRESET_COLORS[0]);
    setFormInitials("");
    setShowAdd(true);
    setEditingId(null);
  }

  function openEdit(m: { id: string; name: string; color: string; initials: string }) {
    setFormName(m.name);
    setFormColor(m.color);
    setFormInitials(m.initials);
    setEditingId(m.id);
    setShowAdd(false);
  }

  function cancelForm() {
    setShowAdd(false);
    setEditingId(null);
  }

  function submitAdd() {
    if (!formName.trim()) return;
    const name = formName.trim();
    const initials = formInitials.trim() || name.split(" ").filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join("");
    addMember({ id: `m${Date.now()}`, name, avatar: "", color: formColor, initials });
    setShowAdd(false);
  }

  function submitEdit() {
    if (!editingId || !formName.trim()) return;
    const name = formName.trim();
    const initials = formInitials.trim() || name.split(" ").filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join("");
    updateMember(editingId, { name, color: formColor, initials });
    setEditingId(null);
  }

  const inputStyle = {
    background: "#0C0C14",
    border: "1px solid rgba(255,255,255,0.07)",
    outline: "none",
    color: "#DEDEE8",
    borderRadius: "8px",
    fontSize: "13px",
    padding: "8px 12px",
    width: "100%",
    transition: "border-color 0.15s",
  } as React.CSSProperties;

  function MemberForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    return (
      <div className="p-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-[#5A5A70] mb-1.5">Nome *</label>
            <input
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (!formInitials) {
                  const parts = e.target.value.trim().split(" ").filter(Boolean);
                  setFormInitials(parts.slice(0,2).map(w => w[0].toUpperCase()).join(""));
                }
              }}
              placeholder="Ex: João Silva"
              autoFocus
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(67,97,238,0.45)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#5A5A70] mb-1.5">Iniciais</label>
            <input
              value={formInitials}
              onChange={(e) => setFormInitials(e.target.value.toUpperCase().slice(0,2))}
              placeholder="Ex: JS"
              maxLength={2}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(67,97,238,0.45)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#5A5A70] mb-1.5">Cor</label>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setFormColor(c)}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110 relative flex items-center justify-center"
                style={{ background: c, boxShadow: `0 2px 8px ${c}50` }}
              >
                {formColor === c && <Check size={11} color="white" strokeWidth={3} />}
              </button>
            ))}
            <label
              className="w-7 h-7 rounded-full cursor-pointer flex items-center justify-center text-[10px] text-white font-bold relative overflow-hidden hover:scale-110 transition-transform"
              style={{ background: "conic-gradient(#EF4444,#F97316,#EAB308,#22C55E,#4361EE,#7C3AED,#EF4444)", border: "2px solid rgba(255,255,255,0.15)" }}
            >
              <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              +
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onSave}
            disabled={!formName.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}
          >
            <Check size={12} /> Salvar
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#5A5A68] hover:text-[#9A9AA8] hover:bg-white/[0.04] transition-all">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionCard title="Membros da equipe">
        {members.map((m) => (
          <div key={m.id}>
            {editingId === m.id ? (
              <MemberForm onSave={submitEdit} onCancel={cancelForm} />
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                  style={{ background: m.color }}
                >
                  {m.initials}
                </div>
                <p className="flex-1 text-[13px] font-medium text-[#CACAD8]">{m.name}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(m)}
                    className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#4A4A60] hover:text-[#ADADB8] hover:bg-white/[0.06] transition-all"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#4A4A60] hover:text-[#F87171] hover:bg-red-500/[0.08] transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {showAdd && <MemberForm onSave={submitAdd} onCancel={cancelForm} />}
        <div className="p-3">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-[12px] font-semibold transition-all hover:brightness-110 w-full justify-center"
            style={{ background: "rgba(67,97,238,0.08)", color: "#4361EE", border: "1px dashed rgba(67,97,238,0.25)" }}
          >
            <Plus size={13} /> Adicionar membro
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function DadosSection() {
  const { segmentos, addSegmento, removeSegmento } = useAppStore();
  const [newSeg, setNewSeg] = useState("");
  const [focused, setFocused] = useState(false);

  function handleAdd() {
    const v = newSeg.trim();
    if (!v) return;
    addSegmento(v);
    setNewSeg("");
  }

  return (
    <div>
      <SectionCard title="Segmentos de empresa">
        <div className="p-4 space-y-3">
          <p className="text-[11.5px] text-[#3A3A50]">
            Segmentos disponíveis ao cadastrar uma empresa.
          </p>
          <div className="flex flex-wrap gap-2">
            {segmentos.map((s) => (
              <div
                key={s}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                style={{ background: "#1A1A26", border: "1px solid rgba(255,255,255,0.08)", color: "#ADADC0" }}
              >
                {s}
                <button
                  onClick={() => removeSegmento(s)}
                  className="text-[#4A4A60] hover:text-[#F87171] transition-colors ml-0.5"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSeg}
              onChange={(e) => setNewSeg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Novo segmento..."
              className="flex-1 px-3 py-2 rounded-[8px] text-[13px] text-[#DEDEE8] placeholder-[#2E2E3A] outline-none"
              style={{
                background: "#0C0C14",
                border: focused ? "1px solid rgba(67,97,238,0.45)" : "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.15s",
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!newSeg.trim()}
              className="px-3 py-2 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState<Section>("perfil");

  const renderSection = () => {
    switch (activeSection) {
      case "perfil": return <PerfilSection />;
      case "workspace": return <WorkspaceSection />;
      case "equipe": return <EquipeSection />;
      case "dados": return <DadosSection />;
      case "aparencia": return <AparenciaSection />;
      case "notificacoes": return <NotificacoesSection />;
      case "integracoes": return <IntegracoesSection />;
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-[11px] text-[#2E2E3A] mb-1 tracking-wider uppercase font-medium">
          Workspace / Configurações
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "rgba(107,114,128,0.12)", border: "1px solid rgba(107,114,128,0.2)" }}
          >
            <Settings size={18} color="#6B7280" />
          </div>
          <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
            Configurações
          </h1>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar nav */}
        <div
          className="w-[220px] shrink-0 p-3 flex flex-col gap-0.5"
          style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <motion.button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between px-3 py-[9px] rounded-[9px] text-[13px] transition-all relative"
                style={{
                  background: isActive ? "#1C1C24" : "transparent",
                  color: isActive ? "#EDEDED" : "#5A5A68",
                  boxShadow: isActive ? "0 0 0 1px rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={14} color={isActive ? "#CDCDD8" : "#3E3E4E"} />
                  <span className="font-medium">{s.label}</span>
                </div>
                {isActive && <ChevronRight size={12} color="#4A4A60" />}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
