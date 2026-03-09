"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Puzzle,
  Star,
  Download,
  ChevronRight,
  Zap,
  BarChart2,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { useAppStore } from "@/lib/store";

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  category: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  rating: number;
  downloads: string;
  status: "installed" | "available" | "soon";
  page?: string;
  tags: string[];
}

const extensions: Extension[] = [
  {
    id: "excalidraw",
    name: "Quadro",
    description:
      "Quadro colaborativo de desenho vetorial. Crie diagramas, wireframes, fluxogramas e esboços diretamente no BizFlow.",
    author: "BizFlow Labs",
    category: "Produtividade",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(167,139,250,0.2) 100%)",
    iconBorder: "rgba(124,58,237,0.3)",
    rating: 4.9,
    downloads: "12.4k",
    status: "installed",
    page: "quadro",
    tags: ["desenho", "diagrama", "colaboração"],
  },
  {
    id: "analytics",
    name: "Analytics Pro",
    description:
      "Dashboards avançados com gráficos interativos, funis de conversão e análise de desempenho por projeto.",
    author: "BizFlow Labs",
    category: "Relatórios",
    icon: <BarChart2 size={18} color="#38BDF8" />,
    iconBg: "linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(14,165,233,0.2) 100%)",
    iconBorder: "rgba(56,189,248,0.25)",
    rating: 4.7,
    downloads: "8.1k",
    status: "soon",
    tags: ["analytics", "gráficos", "métricas"],
  },
  {
    id: "docs",
    name: "Documentos",
    description:
      "Editor de documentos rich-text integrado. Crie wikis, SOPs e documentação técnica vinculados a projetos.",
    author: "BizFlow Labs",
    category: "Documentação",
    icon: <FileText size={18} color="#34D399" />,
    iconBg: "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(16,185,129,0.2) 100%)",
    iconBorder: "rgba(52,211,153,0.25)",
    rating: 4.8,
    downloads: "6.3k",
    status: "soon",
    tags: ["docs", "wiki", "texto"],
  },
  {
    id: "time-tracker",
    name: "Time Tracker",
    description:
      "Rastreamento de horas por task e projeto. Relatórios de produtividade, timesheets e integração com faturamento.",
    author: "BizFlow Labs",
    category: "Produtividade",
    icon: <Clock size={18} color="#FB923C" />,
    iconBg: "linear-gradient(135deg, rgba(251,146,60,0.2) 0%, rgba(249,115,22,0.2) 100%)",
    iconBorder: "rgba(251,146,60,0.25)",
    rating: 4.6,
    downloads: "4.9k",
    status: "soon",
    tags: ["tempo", "horas", "produtividade"],
  },
  {
    id: "automations",
    name: "Automações",
    description:
      "Crie fluxos automatizados entre tasks, projetos e empresas. Triggers, condições e ações sem código.",
    author: "BizFlow Labs",
    category: "Automação",
    icon: <Zap size={18} color="#FBBF24" />,
    iconBg: "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.2) 100%)",
    iconBorder: "rgba(251,191,36,0.25)",
    rating: 4.5,
    downloads: "3.2k",
    status: "soon",
    tags: ["automação", "workflow", "triggers"],
  },
];

const statusLabel: Record<Extension["status"], { label: string; color: string; bg: string }> = {
  installed: { label: "Instalado", color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  available: { label: "Disponível", color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
  soon: { label: "Em breve", color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          fill={i <= Math.round(rating) ? "#FBBF24" : "transparent"}
          color={i <= Math.round(rating) ? "#FBBF24" : "#3A3A48"}
        />
      ))}
      <span className="text-[11px] text-[#5A5A68] ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

function ExtensionCard({
  ext,
  index,
  onOpen,
}: {
  ext: Extension;
  index: number;
  onOpen: (page: string) => void;
}) {
  const status = statusLabel[ext.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06, ease: "easeOut" }}
      className="group relative rounded-[14px] p-5 flex gap-4 transition-all duration-150 cursor-default"
      style={{
        background: "#16161C",
        border: "1px solid rgba(255,255,255,0.055)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
      whileHover={{ borderColor: "rgba(255,255,255,0.1)", y: -1 }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: ext.iconBg,
          border: `1px solid ${ext.iconBorder}`,
        }}
      >
        {ext.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-semibold text-[#E2E2EC] tracking-[-0.015em]">
              {ext.name}
            </span>
            <span
              className="text-[10.5px] font-medium px-2 py-[2px] rounded-full"
              style={{ color: status.color, background: status.bg }}
            >
              {status.label}
            </span>
          </div>

          {/* Action button */}
          {ext.status === "installed" && ext.page ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onOpen(ext.page!)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-[#CDCDD8] shrink-0 transition-all hover:brightness-125 active:scale-[0.97]"
              style={{
                background: "#22222C",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              Abrir
              <ChevronRight size={12} />
            </motion.button>
          ) : ext.status === "available" ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold shrink-0 transition-all hover:brightness-125"
              style={{
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                color: "#fff",
              }}
            >
              <Download size={12} />
              Instalar
            </motion.button>
          ) : (
            <span
              className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] text-[12px] font-medium shrink-0"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#4A4A58",
              }}
            >
              Em breve
            </span>
          )}
        </div>

        <p className="text-[11px] text-[#5A5A64] mb-[3px] font-medium">
          por {ext.author} · {ext.category}
        </p>

        <p className="text-[12.5px] text-[#7A7A88] leading-[1.55] mb-3 line-clamp-2">
          {ext.description}
        </p>

        <div className="flex items-center gap-4">
          <StarRating rating={ext.rating} />
          <span className="flex items-center gap-1 text-[11px] text-[#4A4A58]">
            <Download size={10} color="#4A4A58" />
            {ext.downloads}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ext.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-[1px] rounded-[4px] text-[#4A4A58]"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExtensionsPage() {
  const { setActivePage } = useAppStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  const filtered = q
    ? extensions.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.author.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      )
    : extensions;

  const installed = filtered.filter((e) => e.status === "installed");
  const others = filtered.filter((e) => e.status !== "installed");

  return (
    <div
      className="flex flex-col h-full w-full overflow-y-auto"
      style={{ background: "#0F0F13" }}
    >
      {/* Header */}
      <div
        className="shrink-0 px-8 pt-[22px] pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-3">
            <div
              className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(67,97,238,0.2) 0%, rgba(124,58,237,0.2) 100%)",
                border: "1px solid rgba(67,97,238,0.2)",
              }}
            >
              <Puzzle size={14} color="#7C8FF8" />
            </div>
            <div>
              <h1 className="text-[16px] font-bold text-[#EDEDED] tracking-[-0.02em]">
                Extensões
              </h1>
              <p className="text-[11px] text-[#4A4A55]">Workspace / Extensões</p>
            </div>
          </div>

          {/* Search bar */}
          <div
            className="flex items-center gap-2 px-3 rounded-[10px] transition-all duration-150"
            style={{
              background: "#13131A",
              border: "1px solid rgba(255,255,255,0.07)",
              width: "260px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
            }}
            onClick={() => inputRef.current?.focus()}
          >
            <Search size={13} color="#3E3E50" className="shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar extensões…"
              className="flex-1 bg-transparent py-[9px] text-[13px] text-[#CDCDD8] placeholder-[#3A3A4E] outline-none"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => setQuery("")}
                  className="shrink-0 w-[16px] h-[16px] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={10} color="#5A5A68" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-[13px] text-[#5A5A68] mt-3 max-w-xl leading-relaxed">
          Expanda o BizFlow com ferramentas adicionais. Instale extensões para adicionar novas
          funcionalidades ao seu workspace.
        </p>
      </div>

      <div className="flex-1 px-8 py-6 space-y-8">
        <AnimatePresence mode="wait">
          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center py-20 gap-3"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Search size={18} color="#3A3A4E" />
              </div>
              <p className="text-[14px] font-semibold text-[#3A3A4E]">
                Nenhuma extensão encontrada
              </p>
              <p className="text-[12px] text-[#2E2E3A]">
                Tente buscar por outro nome, categoria ou tag
              </p>
            </motion.div>
          )}

          {/* Results when searching */}
          {filtered.length > 0 && q && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Search size={13} color="#4A4A58" />
                <h2 className="text-[12px] font-semibold text-[#4A4A58] uppercase tracking-widest">
                  Resultados
                </h2>
                <span
                  className="text-[10px] font-bold px-1.5 py-[1px] rounded-full"
                  style={{ background: "rgba(67,97,238,0.12)", color: "#7C8FF8" }}
                >
                  {filtered.length}
                </span>
              </div>
              <div className="space-y-3">
                {filtered.map((ext, i) => (
                  <ExtensionCard
                    key={ext.id}
                    ext={ext}
                    index={i}
                    onOpen={(page) => setActivePage(page)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Normal grouped view */}
          {filtered.length > 0 && !q && (
            <motion.div
              key="grouped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              {/* Installed */}
              {installed.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={13} color="#34D399" />
                    <h2 className="text-[12px] font-semibold text-[#4A4A58] uppercase tracking-widest">
                      Instaladas
                    </h2>
                    <span
                      className="text-[10px] font-bold px-1.5 py-[1px] rounded-full"
                      style={{ background: "rgba(52,211,153,0.12)", color: "#34D399" }}
                    >
                      {installed.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {installed.map((ext, i) => (
                      <ExtensionCard
                        key={ext.id}
                        ext={ext}
                        index={i}
                        onOpen={(page) => setActivePage(page)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Available / Soon */}
              {others.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Puzzle size={13} color="#4A4A58" />
                    <h2 className="text-[12px] font-semibold text-[#4A4A58] uppercase tracking-widest">
                      Disponíveis em breve
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {others.map((ext, i) => (
                      <ExtensionCard
                        key={ext.id}
                        ext={ext}
                        index={i + installed.length}
                        onOpen={(page) => setActivePage(page)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
