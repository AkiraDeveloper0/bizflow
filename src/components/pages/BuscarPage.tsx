"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderKanban, Building2, CheckSquare, X, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getPriorityConfig } from "@/lib/utils";

export function BuscarPage() {
  const { tasks, projects, empresas, setActivePage, setActiveProject } = useAppStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      tasks: tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      ),
      projects: projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      ),
      empresas: empresas.filter(
        (e) => e.name.toLowerCase().includes(q) || e.segment.toLowerCase().includes(q)
      ),
    };
  }, [query, tasks, projects, empresas]);

  const total = results
    ? results.tasks.length + results.projects.length + results.empresas.length
    : 0;

  return (
    <div className="h-full overflow-auto px-6 pt-6 pb-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] text-[#2E2E3A] mb-1.5 tracking-wider uppercase font-medium">
          Workspace / Buscar
        </p>
        <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em] mb-5">
          Buscar
        </h1>

        {/* Search Input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E3E4C] pointer-events-none"
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tasks, projetos, empresas..."
            className="w-full pl-11 pr-10 py-3.5 rounded-[12px] text-[14px] text-[#DEDEE8] placeholder-[#3A3A4A] outline-none transition-all"
            style={{
              background: "#14141A",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 0 0 0 rgba(67,97,238,0)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(67,97,238,0.4)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(67,97,238,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            >
              <X size={12} className="text-[#4A4A58]" />
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 mt-20"
        >
          <div
            className="w-16 h-16 rounded-[16px] flex items-center justify-center"
            style={{ background: "rgba(67,97,238,0.08)", border: "1px solid rgba(67,97,238,0.15)" }}
          >
            <Search size={28} color="#4361EE" opacity={0.6} />
          </div>
          <p className="text-[14px] font-semibold text-[#3A3A4E]">Digite para buscar</p>
          <p className="text-[12px] text-[#2A2A38]">Tasks, projetos e empresas</p>
        </motion.div>
      )}

      {/* No results */}
      {query && total === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 mt-16"
        >
          <p className="text-[14px] font-semibold text-[#3A3A4E]">
            Nenhum resultado para &quot;{query}&quot;
          </p>
          <p className="text-[12px] text-[#2A2A38]">Tente outro termo</p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-[11.5px] text-[#3A3A48] font-medium">
              {total} resultado{total !== 1 ? "s" : ""} para &quot;{query}&quot;
            </p>

            {/* Tasks */}
            {results.tasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare size={13} color="#059669" />
                  <span className="text-[11.5px] font-semibold text-[#4A4A58] uppercase tracking-wider">
                    Tasks ({results.tasks.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {results.tasks.map((task, i) => {
                    const p = getPriorityConfig(task.priority);
                    return (
                      <motion.button
                        key={task.id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setActivePage("tasks")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-left hover:bg-white/[0.03] transition-all"
                        style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <span
                          className="w-[6px] h-[6px] rounded-full shrink-0"
                          style={{ background: p.dotColor }}
                        />
                        <span className="text-[13px] font-medium text-[#C0C0CC] flex-1 text-left truncate">
                          {task.title}
                        </span>
                        <span
                          className="text-[10.5px] px-2 py-[3px] rounded-[5px] font-semibold shrink-0"
                          style={{ background: p.bgColor, color: p.textColor }}
                        >
                          {p.label}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#3A3A48] shrink-0">
                          <Clock size={9} />
                          {task.daysLeft}d
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Projects */}
            {results.projects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FolderKanban size={13} color="#7C3AED" />
                  <span className="text-[11.5px] font-semibold text-[#4A4A58] uppercase tracking-wider">
                    Projetos ({results.projects.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {results.projects.map((project, i) => (
                    <motion.button
                      key={project.id}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { setActiveProject(project.id); setActivePage("projetos"); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-left hover:bg-white/[0.03] transition-all"
                      style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span className="text-base shrink-0">{project.icon}</span>
                      <span className="text-[13px] font-medium text-[#C0C0CC] flex-1 truncate">
                        {project.name}
                      </span>
                      <span className="text-[11px] text-[#3A3A48]">{project.progress}%</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Empresas */}
            {results.empresas.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={13} color="#4361EE" />
                  <span className="text-[11.5px] font-semibold text-[#4A4A58] uppercase tracking-wider">
                    Empresas ({results.empresas.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {results.empresas.map((empresa, i) => (
                    <motion.button
                      key={empresa.id}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setActivePage("empresas")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-left hover:bg-white/[0.03] transition-all"
                      style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div
                        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: empresa.color }}
                      >
                        {empresa.initials}
                      </div>
                      <span className="text-[13px] font-medium text-[#C0C0CC] flex-1 truncate">
                        {empresa.name}
                      </span>
                      <span className="text-[11px] text-[#3A3A48]">{empresa.segment}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
