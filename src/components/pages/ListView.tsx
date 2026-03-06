"use client";

import { motion } from "framer-motion";
import { MessageSquare, Paperclip, Clock, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getPriorityConfig, getStatusConfig } from "@/lib/utils";
import { MemberStack } from "@/components/common/MemberAvatar";

export function ListView() {
  const { tasks } = useAppStore();

  return (
    <div className="space-y-1.5 pb-6">
      {/* Header */}
      <div
        className="grid grid-cols-12 px-4 py-2.5 text-[11px] font-semibold text-[#3A3A48] tracking-wider uppercase"
      >
        <div className="col-span-5">Título</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Prioridade</div>
        <div className="col-span-1 text-center">Progresso</div>
        <div className="col-span-2 text-right">Membros</div>
      </div>

      {tasks.map((task, i) => {
        const priorityConfig = getPriorityConfig(task.priority);
        const statusConfig = getStatusConfig(task.status);
        const progressPercent = Math.round((task.progress / task.progressTotal) * 100);

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
            className="grid grid-cols-12 items-center px-4 py-3.5 rounded-[10px] cursor-pointer group transition-all"
            style={{
              background: "#14141A",
              border: "1px solid rgba(255,255,255,0.045)",
            }}
          >
            {/* Title */}
            <div className="col-span-5 flex items-center gap-3">
              <ChevronRight
                size={13}
                className="text-[#2A2A36] group-hover:text-[#4A4A58] transition-colors shrink-0"
              />
              <span className="text-[13px] font-medium text-[#C8C8D2] truncate">
                {task.title}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold"
                style={{
                  background: `${statusConfig.color}15`,
                  color: statusConfig.color,
                }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: statusConfig.color }}
                />
                {statusConfig.label}
              </span>
            </div>

            {/* Priority */}
            <div className="col-span-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold"
                style={{
                  background: priorityConfig.bgColor,
                  color: priorityConfig.textColor,
                }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: priorityConfig.dotColor }}
                />
                {priorityConfig.label}
              </span>
            </div>

            {/* Progress */}
            <div className="col-span-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-[4px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #4361EE 0%, #7C3AED 100%)",
                  }}
                />
              </div>
              <span className="text-[10px] text-[#3A3A48]">{progressPercent}%</span>
            </div>

            {/* Members */}
            <div className="col-span-2 flex justify-end">
              <MemberStack members={task.members} max={2} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
