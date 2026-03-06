"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  LayoutGrid,
  Bell,
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Calendar,
  BarChart3,
  HelpCircle,
  Settings,
  Building2,
  CheckSquare,
  X,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  badge?: boolean;
}

const topNavItems: NavItem[] = [
  { id: "search", label: "Buscar", icon: Search },
  { id: "ai", label: "IA Assistente", icon: Sparkles },
  { id: "templates", label: "Templates", icon: LayoutGrid },
  { id: "notificacoes", label: "Notificações", icon: Bell, badge: true },
];

const mainNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "empresas", label: "Empresas", icon: Building2 },
  { id: "projetos", label: "Projetos", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "calendario", label: "Calendário", icon: Calendar },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "ajuda", label: "Ajuda & Central", icon: HelpCircle },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

function NavItemComponent({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-[9px] rounded-[9px] text-[13px] transition-colors duration-100 relative group",
        isActive
          ? "text-[#EDEDED]"
          : "text-[#5A5A68] hover:text-[#ADADB8] hover:bg-white/[0.03]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-[9px]"
          style={{
            background: "#1C1C24",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 2px 6px rgba(0,0,0,0.25)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <span className="relative z-10 shrink-0">
        <Icon
          size={15}
          color={isActive ? "#CDCDD8" : "#3E3E4E"}
          className="transition-colors group-hover:!text-[#7A7A88]"
        />
      </span>
      <span className="relative z-10 font-medium tracking-[-0.01em] flex-1 text-left">
        {item.label}
      </span>
      {item.badge && (
        <span className="relative z-10 w-[7px] h-[7px] rounded-full bg-[#4361EE]" />
      )}
    </motion.button>
  );
}

export function Sidebar() {
  const { activePage, setActivePage } = useAppStore();

  return (
    <aside
      className="w-[260px] shrink-0 flex flex-col"
      style={{
        background: "#0F0F13",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        height: "100%",
      }}
    >
      {/* ── Logo Row ── */}
      <div className="px-4 pt-[18px] pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                boxShadow: "0 2px 10px rgba(67,97,238,0.35)",
              }}
            >
              <Briefcase size={13} color="#fff" />
            </div>
            <span className="font-extrabold text-[15px] text-[#EDEDED] tracking-[-0.025em]">
              BizFlow
            </span>
          </div>
          <div
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer ring-[1.5px] ring-[#2A2A38] hover:ring-[#4361EE]/50 transition-all"
            style={{ background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)" }}
            title="Rafael Costa"
          >
            RC
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 mb-2 shrink-0" style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* ── Top Nav ── */}
      <div className="px-3 space-y-[2px] shrink-0">
        {topNavItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 my-2 shrink-0" style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* ── Main Nav (scrollable) ── */}
      <div className="px-3 space-y-[2px] overflow-y-auto flex-1 min-h-0">
        {mainNavItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </div>

      {/* ── Bottom Card ── */}
      <div className="p-3 pt-2 shrink-0">
        <div
          className="relative rounded-[14px] p-4 overflow-hidden"
          style={{
            background: "#15151C",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Close */}
          <button className="absolute top-3 right-3 w-[18px] h-[18px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <X size={10} color="#44444E" />
          </button>

          {/* Icon */}
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg, rgba(67,97,238,0.18) 0%, rgba(124,58,237,0.18) 100%)",
              border: "1px solid rgba(67,97,238,0.18)",
            }}
          >
            <Building2 size={16} color="#4361EE" />
          </div>

          <p className="font-bold text-[12.5px] text-[#DEDEE8] mb-[3px] tracking-[-0.01em]">
            Central de Negócios
          </p>
          <p className="text-[11px] text-[#46464E] leading-[1.5] mb-3">
            Organize empresas, projetos e tarefas em um só lugar
          </p>

          <button
            onClick={() => setActivePage("empresas")}
            className="w-full py-[7px] rounded-[7px] text-[11.5px] font-semibold text-[#CDCDD8] transition-all hover:brightness-125 active:scale-[0.98]"
            style={{
              background: "#22222C",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Abrir painel
          </button>
        </div>
      </div>
    </aside>
  );
}
