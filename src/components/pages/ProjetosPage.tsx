"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  LayoutGrid,
  List,
  GitBranch,
  Table2,
  Plus,
  FolderOpen,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store";
import { ViewMode } from "@/types";
import { cn } from "@/lib/utils";
import { ListView } from "./ListView";
import { NovaTaskModal } from "@/components/modals/NovaTaskModal";
import { FiltrosPanel } from "@/components/panels/FiltrosPanel";

const KanbanBoard = dynamic(
  () => import("@/components/kanban/KanbanBoard").then((m) => m.KanbanBoard),
  { ssr: false, loading: () => <div className="h-40" /> }
);

const VIEW_TABS: {
  id: ViewMode;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "list", label: "Lista", icon: List },
  { id: "timeline", label: "Timeline", icon: GitBranch },
  { id: "board", label: "Board", icon: Table2 },
];

export function ProjetosPage() {
  const {
    viewMode,
    setViewMode,
    activeProjectId,
    setActiveProject,
    projects,
    taskFilters,
  } = useAppStore();
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showNovaTaskModal, setShowNovaTaskModal] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);

  const activeFilterCount =
    taskFilters.priorities.length + taskFilters.categories.length;

  return (
    <div className="flex flex-col h-full relative">
      {/* ─── Top Header ─── */}
      <div
        className="shrink-0 px-6 pt-[18px] pb-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 mb-4">
          <button className="w-6 h-6 flex items-center justify-center rounded-[6px] text-[#3A3A48] hover:text-[#8A8A98] hover:bg-white/[0.04] transition-all">
            <ArrowLeft size={13} />
          </button>
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#3A3A48]">
            <span className="hover:text-[#6A6A78] cursor-pointer transition-colors">
              Workspace
            </span>
            <ChevronRight size={10} />
            <span className="hover:text-[#6A6A78] cursor-pointer transition-colors">
              Projetos
            </span>
            <ChevronRight size={10} />
            <span className="text-[#6A6A78] font-medium">{activeProject?.name}</span>
          </div>
        </div>

        {/* Title + Actions row */}
        <div className="flex items-center justify-between mb-4 gap-4">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center shrink-0"
              style={{
                background: `${activeProject?.color}1A`,
                border: `1px solid ${activeProject?.color}28`,
              }}
            >
              <FolderOpen size={20} color={activeProject?.color || "#4361EE"} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold text-[#EDEDED] tracking-[-0.025em] leading-none whitespace-nowrap">
                  {activeProject?.name || "Painel de Projetos"}
                </h1>
                {/* Project switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowProjectPicker((v) => !v)}
                    className="flex items-center gap-1 px-2 py-1 rounded-[6px] text-[#3A3A48] hover:text-[#7A7A88] hover:bg-white/[0.04] transition-all"
                  >
                    <ChevronDown size={13} />
                  </button>
                  {showProjectPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-full left-0 mt-1 z-50 rounded-[11px] py-1 min-w-[190px]"
                      style={{
                        background: "#18181F",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                      }}
                    >
                      {projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveProject(p.id);
                            setShowProjectPicker(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] transition-colors hover:bg-white/[0.04]",
                            p.id === activeProjectId
                              ? "text-[#EDEDED]"
                              : "text-[#6A6A78]"
                          )}
                        >
                          <span className="text-base">{p.icon}</span>
                          <span className="font-medium">{p.name}</span>
                          {p.id === activeProjectId && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4361EE]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-[11.5px] text-[#3A3A50] mt-[3px] truncate max-w-[340px]">
                {activeProject?.description}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFiltros((v) => !v)}
              className="relative flex items-center gap-1.5 px-3 py-[7px] rounded-[8px] text-[12px] font-medium transition-all"
              style={{
                color: showFiltros || activeFilterCount > 0 ? "#4361EE" : "#5A5A68",
                background:
                  showFiltros || activeFilterCount > 0
                    ? "rgba(67,97,238,0.1)"
                    : "transparent",
                border:
                  showFiltros || activeFilterCount > 0
                    ? "1px solid rgba(67,97,238,0.25)"
                    : "1px solid transparent",
              }}
            >
              <SlidersHorizontal size={13} />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span
                  className="text-[9px] font-bold px-1 py-0.5 rounded-full ml-0.5"
                  style={{ background: "#4361EE", color: "white" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowNovaTaskModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                boxShadow: "0 2px 12px rgba(67,97,238,0.28)",
              }}
            >
              <Plus size={13} />
              <span>Nova Task</span>
            </button>
          </div>
        </div>

        {/* ── View Tabs ── */}
        <div className="flex items-center gap-0.5">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "relative flex items-center gap-[7px] px-3.5 py-[9px] text-[12px] font-medium transition-colors",
                  isActive ? "text-[#DEDEE8]" : "text-[#44444E] hover:text-[#7A7A88]"
                )}
              >
                <span className="flex items-center gap-[7px]">
                  <Icon size={12} />
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                    style={{ background: "#4361EE" }}
                    transition={{ type: "spring", stiffness: 500, damping: 45 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ─── Board Content ─── */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full px-6 pt-5 overflow-auto">
          {viewMode === "kanban" && <KanbanBoard />}
          {viewMode === "list" && <ListView />}
          {viewMode === "timeline" && <TimelinePlaceholder />}
          {viewMode === "board" && <BoardPlaceholder />}
        </div>

        {/* Filtros Panel — slides in over the board area */}
        <FiltrosPanel
          open={showFiltros}
          onClose={() => setShowFiltros(false)}
        />
      </div>

      {/* Nova Task Modal */}
      {showNovaTaskModal && (
        <NovaTaskModal onClose={() => setShowNovaTaskModal(false)} />
      )}
    </div>
  );
}

function TimelinePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center"
        style={{
          background: "rgba(67,97,238,0.08)",
          border: "1px solid rgba(67,97,238,0.15)",
        }}
      >
        <GitBranch size={24} color="#4361EE" />
      </div>
      <p className="text-[13.5px] font-semibold text-[#3A3A48]">
        Timeline em breve
      </p>
      <p className="text-[12px] text-[#2A2A36]">
        Esta visualização está sendo desenvolvida
      </p>
    </div>
  );
}

function BoardPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center"
        style={{
          background: "rgba(124,58,237,0.08)",
          border: "1px solid rgba(124,58,237,0.15)",
        }}
      >
        <Table2 size={24} color="#7C3AED" />
      </div>
      <p className="text-[13.5px] font-semibold text-[#3A3A48]">
        Board em breve
      </p>
      <p className="text-[12px] text-[#2A2A36]">
        Esta visualização está sendo desenvolvida
      </p>
    </div>
  );
}
