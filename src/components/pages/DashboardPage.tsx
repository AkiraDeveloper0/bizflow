"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckSquare,
  FolderKanban,
  Building2,
  ArrowUpRight,
  Clock,
  type LucideProps,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getPriorityConfig } from "@/lib/utils";
import { MemberStack } from "@/components/common/MemberAvatar";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="flex-1 min-w-0 rounded-[14px] p-[18px]"
      style={{
        background: "#14141A",
        border: "1px solid rgba(255,255,255,0.055)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}22` }}
        >
          <Icon size={15} color={color} />
        </div>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-[5px] tracking-wider"
          style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
        >
          +12%
        </span>
      </div>
      <p className="text-[24px] font-bold text-[#EDEDED] tracking-[-0.04em] leading-none mb-[3px]">
        {value}
      </p>
      <p className="text-[11.5px] font-semibold text-[#7A7A88] mb-[2px] truncate">{label}</p>
      <p className="text-[10.5px] text-[#3A3A48] truncate">{sub}</p>
    </motion.div>
  );
}

export function DashboardPage() {
  const { tasks, projects, empresas } = useAppStore();
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const recentTasks = tasks.slice(0, 6);

  return (
    <div className="h-full overflow-auto px-6 pt-6 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-[11px] text-[#2E2E3A] mb-1.5 tracking-wider uppercase font-medium">
          Workspace / Dashboard
        </p>
        <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
          Visão Geral
        </h1>
        <p className="text-[12px] text-[#3A3A4E] mt-1">
          Acompanhe todas as métricas dos seus negócios
        </p>
      </motion.div>

      {/* Stats Row — 4 equal cols */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Empresas ativas"
          value={empresas.filter((e) => e.status === "ativa").length}
          sub={`${empresas.length} no total`}
          icon={Building2}
          color="#4361EE"
          delay={0}
        />
        <StatCard
          label="Projetos ativos"
          value={projects.filter((p) => p.status === "active").length}
          sub={`${projects.length} no total`}
          icon={FolderKanban}
          color="#7C3AED"
          delay={0.05}
        />
        <StatCard
          label="Tasks abertas"
          value={todoCount + inProgressCount}
          sub={`${doneCount} concluídas`}
          icon={CheckSquare}
          color="#059669"
          delay={0.1}
        />
        <StatCard
          label="Em andamento"
          value={inProgressCount}
          sub="Alta prioridade"
          icon={TrendingUp}
          color="#F97316"
          delay={0.15}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Tasks — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 rounded-[14px] p-5"
          style={{
            background: "#14141A",
            border: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-semibold text-[#C0C0CC]">Tasks recentes</h2>
            <button className="text-[11.5px] text-[#4361EE] hover:text-[#6B8BFF] transition-colors flex items-center gap-1 font-medium">
              Ver todas <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="space-y-[3px]">
            {recentTasks.map((task, i) => {
              const priorityConfig = getPriorityConfig(task.priority);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-3 px-3 py-[9px] rounded-[8px] hover:bg-white/[0.025] transition-all cursor-pointer group"
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full shrink-0"
                    style={{ background: priorityConfig.dotColor }}
                  />
                  <span className="text-[12.5px] text-[#B0B0BC] flex-1 truncate group-hover:text-[#CDCDD8] transition-colors">
                    {task.title}
                  </span>
                  <span
                    className="text-[10.5px] px-2 py-[3px] rounded-[5px] font-semibold shrink-0"
                    style={{
                      background: priorityConfig.bgColor,
                      color: priorityConfig.textColor,
                    }}
                  >
                    {priorityConfig.label}
                  </span>
                  <span className="flex items-center gap-1 text-[10.5px] text-[#3A3A48] shrink-0">
                    <Clock size={9} />
                    {task.daysLeft}d
                  </span>
                  <MemberStack members={task.members} max={1} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-[14px] p-5"
          style={{
            background: "#14141A",
            border: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-semibold text-[#C0C0CC]">Projetos</h2>
          </div>
          <div className="space-y-[6px]">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex flex-col gap-[7px] px-3 py-3 rounded-[10px] hover:bg-white/[0.025] cursor-pointer transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-sm"
                    style={{ background: `${project.color}1A` }}
                  >
                    {project.icon}
                  </div>
                  <span className="text-[12px] font-semibold text-[#B0B0BC] flex-1 truncate">
                    {project.name}
                  </span>
                  <span className="text-[10px] text-[#3A3A48] font-medium shrink-0">
                    {project.progress}%
                  </span>
                </div>
                <div
                  className="h-[3px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: project.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
