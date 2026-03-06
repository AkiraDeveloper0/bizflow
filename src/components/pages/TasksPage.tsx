"use client";

import { motion } from "framer-motion";
import {
  CheckSquare,
  Plus,
  ChevronRight,
  MessageSquare,
  Paperclip,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getPriorityConfig, getStatusConfig } from "@/lib/utils";
import { MemberStack } from "@/components/common/MemberAvatar";
import { TaskStatus } from "@/types";
import { useState } from "react";
import { NovaTaskModal } from "@/components/modals/NovaTaskModal";

const STATUS_FILTERS: { id: TaskStatus | "all"; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "Em andamento" },
  { id: "review", label: "Revisão" },
  { id: "done", label: "Concluídas" },
];

export function TasksPage() {
  const { tasks } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);

  const filtered =
    activeFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

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
            <ChevronRight size={11} />
            <span className="text-[#7A7A88]">Tasks</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center"
              style={{
                background: "rgba(5,150,105,0.12)",
                border: "1px solid rgba(5,150,105,0.2)",
              }}
            >
              <CheckSquare size={20} style={{ color: "#059669" }} />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#EDEDED] tracking-[-0.03em]">
                Tasks
              </h1>
              <p className="text-[12px] text-[#4A4A58]">
                {tasks.length} tasks no total
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
          Nova Task
        </button>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-5">
        {STATUS_FILTERS.map((f) => (
          <motion.button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            whileTap={{ scale: 0.97 }}
            className="relative px-3.5 py-2 rounded-[8px] text-[12px] font-medium transition-all"
            style={{
              color: activeFilter === f.id ? "#EDEDED" : "#4A4A58",
              background: activeFilter === f.id ? "#1E1E28" : "transparent",
              border:
                activeFilter === f.id
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid transparent",
            }}
          >
            {f.label}
            <span
              className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]"
              style={{
                background:
                  activeFilter === f.id
                    ? "rgba(67,97,238,0.15)"
                    : "rgba(255,255,255,0.06)",
                color: activeFilter === f.id ? "#4361EE" : "#3A3A48",
              }}
            >
              {f.id === "all"
                ? tasks.length
                : tasks.filter((t) => t.status === f.id).length}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filtered.map((task, i) => {
          const priorityConfig = getPriorityConfig(task.priority);
          const progressPercent = Math.round(
            (task.progress / task.progressTotal) * 100
          );

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              whileHover={{ backgroundColor: "#1A1A22" }}
              className="flex items-center gap-4 px-5 py-4 rounded-[12px] cursor-pointer transition-all group"
              style={{
                background: "#14141A",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Tags */}
              <div className="flex items-center gap-1.5 shrink-0 w-[160px]">
                <span
                  className="flex items-center gap-1 px-2 py-[3px] rounded-[5px] text-[10.5px] font-semibold"
                  style={{
                    background: priorityConfig.bgColor,
                    color: priorityConfig.textColor,
                  }}
                >
                  <span
                    className="w-[4px] h-[4px] rounded-full"
                    style={{ background: priorityConfig.dotColor }}
                  />
                  {priorityConfig.label}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-[3px] rounded-[5px]"
                  style={{
                    background: "rgba(59,130,246,0.13)",
                    color: "#60A5FA",
                  }}
                >
                  {task.category}
                </span>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#C8C8D2] truncate">
                  {task.title}
                </p>
                <p className="text-[11px] text-[#3A3A48] truncate mt-0.5">
                  {task.description}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1 text-[11px] text-[#3A3A48]">
                  <MessageSquare size={11} />
                  {task.comments}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#3A3A48]">
                  <Paperclip size={11} />
                  {task.attachments}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#3A3A48]">
                  <Clock size={11} />
                  {task.daysLeft}d
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <div
                  className="flex-1 h-[4px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #4361EE, #7C3AED)",
                    }}
                  />
                </div>
                <span className="text-[11px] text-[#3A3A48] font-medium w-8 text-right">
                  {progressPercent}%
                </span>
              </div>

              {/* Members */}
              <div className="shrink-0">
                <MemberStack members={task.members} max={2} />
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-14 h-14 rounded-[14px] flex items-center justify-center"
              style={{
                background: "rgba(5,150,105,0.08)",
                border: "1px solid rgba(5,150,105,0.15)",
              }}
            >
              <CheckSquare size={24} color="#059669" />
            </div>
            <p className="text-[13px] font-semibold text-[#3A3A48]">
              Nenhuma task encontrada
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <NovaTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
