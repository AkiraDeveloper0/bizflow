"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Users,
  Briefcase,
  Zap,
  Star,
  Plus,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  category: string;
  tasks: number;
  popular?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Sprint Ágil",
    description: "Kanban com backlog, sprint ativo e revisão para times de produto",
    icon: Zap,
    color: "#4361EE",
    category: "Produto",
    tasks: 12,
    popular: true,
  },
  {
    id: "t2",
    name: "Onboarding de Cliente",
    description: "Fluxo completo de boas-vindas, treinamento e ativação",
    icon: Users,
    color: "#059669",
    category: "Operacional",
    tasks: 8,
    popular: true,
  },
  {
    id: "t3",
    name: "Planejamento Trimestral",
    description: "Defina OKRs, metas e milestones para o trimestre",
    icon: BarChart3,
    color: "#7C3AED",
    category: "Estratégia",
    tasks: 15,
  },
  {
    id: "t4",
    name: "Lançamento de Produto",
    description: "Checklist de marketing, engenharia e suporte para go-to-market",
    icon: Star,
    color: "#F97316",
    category: "Marketing",
    tasks: 20,
    popular: true,
  },
  {
    id: "t5",
    name: "Gestão Financeira",
    description: "Controle de despesas, receitas e metas financeiras mensais",
    icon: Briefcase,
    color: "#DB2777",
    category: "Financeiro",
    tasks: 10,
  },
  {
    id: "t6",
    name: "Documentação Técnica",
    description: "Estrutura para criar wikis, guias e especificações de produto",
    icon: FolderKanban,
    color: "#0EA5E9",
    category: "Desenvolvimento",
    tasks: 6,
  },
  {
    id: "t7",
    name: "Kanban Simples",
    description: "Board básico com 4 colunas para qualquer tipo de projeto",
    icon: LayoutGrid,
    color: "#6B7280",
    category: "Geral",
    tasks: 4,
  },
  {
    id: "t8",
    name: "Lista de Tasks Pessoal",
    description: "Organize suas tarefas do dia a dia por prioridade",
    icon: CheckSquare,
    color: "#22C55E",
    category: "Pessoal",
    tasks: 5,
  },
];

const CATEGORIES = ["Todos", "Produto", "Operacional", "Estratégia", "Marketing", "Financeiro", "Desenvolvimento", "Geral", "Pessoal"];

export function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [applied, setApplied] = useState<string | null>(null);
  const { setActivePage } = useAppStore();

  const filtered = activeCategory === "Todos"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="h-full overflow-auto px-6 pt-6 pb-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] text-[#2E2E3A] mb-1.5 tracking-wider uppercase font-medium">
          Workspace / Templates
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
              Templates
            </h1>
            <p className="text-[12px] text-[#3A3A4E] mt-1">
              Inicie projetos rapidamente com templates prontos
            </p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-[8px] text-[11.5px] font-medium transition-all"
            style={{
              background: activeCategory === cat ? "#1E1E28" : "transparent",
              color: activeCategory === cat ? "#DEDEE8" : "#4A4A58",
              border: activeCategory === cat
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid transparent",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((template, i) => {
          const Icon = template.icon;
          const isApplied = applied === template.id;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="rounded-[14px] p-5 cursor-pointer group transition-all"
              style={{
                background: "#14141A",
                border: "1px solid rgba(255,255,255,0.055)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                  style={{ background: `${template.color}18`, border: `1px solid ${template.color}22` }}
                >
                  <Icon size={17} color={template.color} />
                </div>
                <div className="flex items-center gap-2">
                  {template.popular && (
                    <span
                      className="text-[10px] font-bold px-2 py-[3px] rounded-[5px]"
                      style={{ background: "rgba(67,97,238,0.12)", color: "#6B8BFF" }}
                    >
                      Popular
                    </span>
                  )}
                  <span
                    className="text-[10px] font-medium px-2 py-[3px] rounded-[5px]"
                    style={{ background: "rgba(255,255,255,0.055)", color: "#4A4A58" }}
                  >
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-[13.5px] font-semibold text-[#DEDEE8] mb-1.5 tracking-[-0.01em]">
                {template.name}
              </h3>
              <p className="text-[11.5px] text-[#3A3A4E] leading-relaxed mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#3A3A48]">
                  {template.tasks} tasks incluídas
                </span>
                <button
                  onClick={() => {
                    setApplied(template.id);
                    setTimeout(() => {
                      setActivePage("projetos");
                    }, 800);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[11.5px] font-semibold transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: isApplied
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(67,97,238,0.15)",
                    color: isApplied ? "#22C55E" : "#6B8BFF",
                    border: isApplied
                      ? "1px solid rgba(34,197,94,0.2)"
                      : "1px solid rgba(67,97,238,0.2)",
                  }}
                >
                  {isApplied ? (
                    "✓ Aplicado!"
                  ) : (
                    <>
                      <Plus size={11} />
                      Usar template
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
