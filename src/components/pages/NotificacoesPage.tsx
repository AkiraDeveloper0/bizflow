"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckSquare,
  FolderKanban,
  MessageSquare,
  Settings,
  Check,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface Notif {
  id: string;
  type: "task" | "project" | "comment" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  {
    id: "n1",
    type: "task",
    title: "Task atribuída a você",
    description: '"Criar visualizações de gráficos" foi atribuída ao seu nome',
    time: "2 min",
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    title: "Novo comentário",
    description: 'Ana Lima comentou em "Validar identidade visual"',
    time: "15 min",
    read: false,
  },
  {
    id: "n3",
    type: "project",
    title: "Projeto atualizado",
    description: "Rebranding Visual atingiu 80% de progresso",
    time: "1h",
    read: false,
  },
  {
    id: "n4",
    type: "task",
    title: "Task concluída",
    description: '"Definir paleta de cores" foi marcada como concluída',
    time: "3h",
    read: true,
  },
  {
    id: "n5",
    type: "system",
    title: "Backup realizado",
    description: "Backup automático do workspace concluído com sucesso",
    time: "5h",
    read: true,
  },
  {
    id: "n6",
    type: "comment",
    title: "Você foi mencionado",
    description: 'Lucas Souza mencionou você em "Auditoria de acessos"',
    time: "1d",
    read: true,
  },
  {
    id: "n7",
    type: "project",
    title: "Novo projeto criado",
    description: '"Automação Fiscal" foi adicionado ao workspace',
    time: "2d",
    read: true,
  },
  {
    id: "n8",
    type: "task",
    title: "Prazo se aproximando",
    description: '"Confirmar fontes de dados financeiros" vence em 4 dias',
    time: "2d",
    read: true,
  },
];

const TYPE_CONFIG = {
  task: { Icon: CheckSquare, color: "#4361EE", bg: "rgba(67,97,238,0.12)" },
  project: { Icon: FolderKanban, color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
  comment: { Icon: MessageSquare, color: "#059669", bg: "rgba(5,150,105,0.12)" },
  system: { Icon: Settings, color: "#F97316", bg: "rgba(249,115,22,0.12)" },
};

const FILTER_TABS = [
  { id: "all" as const, label: "Todas" },
  { id: "unread" as const, label: "Não lidas" },
  { id: "task" as const, label: "Tasks" },
  { id: "project" as const, label: "Projetos" },
];

export function NotificacoesPage() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<"all" | "unread" | "task" | "project">("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "task") return n.type === "task";
    if (filter === "project") return n.type === "project";
    return true;
  });

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const remove = (id: string) => setNotifs((ns) => ns.filter((n) => n.id !== id));

  return (
    <div className="h-full overflow-auto px-7 pt-7 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#3A3A48] mb-2">
            <span>Workspace</span>
            <span className="text-[#2E2E3A]">›</span>
            <span className="text-[#7A7A88]">Notificações</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center relative"
              style={{
                background: "rgba(67,97,238,0.12)",
                border: "1px solid rgba(67,97,238,0.2)",
              }}
            >
              <Bell size={20} color="#4361EE" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: "#EF4444" }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
                Notificações
              </h1>
              <p className="text-[12px] text-[#4A4A58]">
                {unreadCount > 0 ? `${unreadCount} não lidas` : "Tudo em dia ✓"}
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[9px] text-[12px] font-medium transition-all mt-4"
            style={{
              color: "#4361EE",
              border: "1px solid rgba(67,97,238,0.22)",
              background: "rgba(67,97,238,0.06)",
            }}
          >
            <Check size={13} />
            Marcar todas como lidas
          </button>
        )}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className="relative px-3.5 py-[7px] rounded-[8px] text-[12px] font-medium transition-all"
            style={{
              color: filter === tab.id ? "#DEDEE8" : "#4A4A58",
              background: filter === tab.id ? "#1E1E28" : "transparent",
              border:
                filter === tab.id
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid transparent",
            }}
          >
            {tab.label}
            {tab.id === "unread" && unreadCount > 0 && (
              <span
                className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "#4361EE", color: "white" }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-[5px]">
        <AnimatePresence initial={false}>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-3"
            >
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center"
                style={{
                  background: "rgba(67,97,238,0.08)",
                  border: "1px solid rgba(67,97,238,0.15)",
                }}
              >
                <Bell size={24} color="#4361EE" />
              </div>
              <p className="text-[13px] font-semibold text-[#4A4A58]">
                Nenhuma notificação
              </p>
              <p className="text-[12px] text-[#2A2A36]">
                Você está em dia com tudo!
              </p>
            </motion.div>
          )}

          {filtered.map((notif, i) => {
            const { Icon, color, bg } = TYPE_CONFIG[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                onClick={() => markRead(notif.id)}
                className="group flex items-start gap-4 px-5 py-4 rounded-[12px] cursor-pointer transition-all"
                style={{
                  background: notif.read ? "#14141A" : "#16162A",
                  border: notif.read
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "1px solid rgba(67,97,238,0.18)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: bg }}
                >
                  <Icon size={15} color={color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#DEDEE8] leading-tight">
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: "#4361EE" }}
                      />
                    )}
                  </div>
                  <p className="text-[12px] text-[#4A4A58] mt-[3px] leading-relaxed">
                    {notif.description}
                  </p>
                </div>

                {/* Right: time + delete */}
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span className="text-[11px] text-[#3A3A48]">{notif.time} atrás</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-[6px] text-[#3A3A48] hover:text-[#EF4444] hover:bg-white/[0.06] transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
