"use client";

import { motion } from "framer-motion";
import { Building2, Plus, FolderKanban, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Empresa } from "@/types";
import { useState } from "react";
import { NovaEmpresaModal } from "@/components/modals/NovaEmpresaModal";

const STATUS_LABELS = {
  ativa: { label: "Ativa", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  inativa: { label: "Inativa", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  em_formacao: { label: "Em formação", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
};

function EmpresaCard({ empresa, delay }: { empresa: Empresa; delay: number }) {
  const statusConfig = STATUS_LABELS[empresa.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      whileHover={{
        y: -2,
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.09)",
      }}
      className="rounded-[15px] p-5 cursor-pointer transition-all"
      style={{
        background: "#14141A",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.055)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[15px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${empresa.color}CC 0%, ${empresa.color}88 100%)`,
              boxShadow: `0 4px 12px ${empresa.color}30`,
            }}
          >
            {empresa.initials}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#DEDEE8] leading-tight">
              {empresa.name}
            </p>
            <p className="text-[11px] text-[#4A4A58] mt-0.5">{empresa.segment}</p>
          </div>
        </div>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px]"
          style={{ background: statusConfig.bg, color: statusConfig.color }}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-[12px] text-[#4A4A58] leading-relaxed mb-4 line-clamp-2">
        {empresa.description}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white"
            style={{ background: empresa.responsible.color }}
            title={empresa.responsible.name}
          >
            {empresa.responsible.initials}
          </div>
          <span className="text-[11px] text-[#4A4A58]">
            {empresa.responsible.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#4A4A58]">
          <FolderKanban size={12} />
          <span>{empresa.projectCount} projetos</span>
        </div>
      </div>
    </motion.div>
  );
}

export function EmpresasPage() {
  const { empresas } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full overflow-auto px-7 pt-7 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-7"
      >
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#3A3A48] mb-2">
            <span>Workspace</span>
            <ChevronRight size={11} />
            <span className="text-[#7A7A88]">Empresas</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center"
              style={{
                background: "rgba(67,97,238,0.12)",
                border: "1px solid rgba(67,97,238,0.2)",
              }}
            >
              <Building2 size={20} style={{ color: "#4361EE" }} />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
                Empresas
              </h1>
              <p className="text-[12px] text-[#4A4A58]">
                {empresas.length} empresas no workspace
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-[9px] text-[12.5px] font-semibold text-white mt-4 transition-all hover:brightness-110 active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
            boxShadow: "0 2px 10px rgba(67,97,238,0.3)",
          }}
        >
          <Plus size={14} />
          Nova Empresa
        </button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {empresas.map((empresa, i) => (
          <EmpresaCard key={empresa.id} empresa={empresa} delay={i * 0.07} />
        ))}
      </div>

      {/* Modal */}
      {showModal && <NovaEmpresaModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
