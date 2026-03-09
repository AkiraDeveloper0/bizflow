"use client";

import { motion } from "framer-motion";
import { MessageSquare, Paperclip, Clock, CornerDownRight } from "lucide-react";
import { Task } from "@/types";
import { getPriorityConfig } from "@/lib/utils";
import { MemberStack } from "@/components/common/MemberAvatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const priorityConfig = getPriorityConfig(task.priority);
  const progressPercent = Math.round((task.progress / task.progressTotal) * 100);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, opacity: isSortableDragging ? 0.35 : 1 }}
      {...attributes}
      {...listeners}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="rounded-[13px] p-[14px] cursor-grab active:cursor-grabbing select-none group"
        style={{
          background: "#17171D",
          border: "1px solid rgba(255,255,255,0.055)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
        }}
        whileHover={{
          y: -2,
          transition: { duration: 0.12 },
        }}
      >
        {/* ── Tags ── */}
        <div className="flex items-center gap-[6px] mb-[11px]">
          <span
            className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-[5px] text-[10.5px] font-semibold"
            style={{ background: priorityConfig.bgColor, color: priorityConfig.textColor }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{ background: priorityConfig.dotColor }}
            />
            {priorityConfig.label}
          </span>
          {task.tags[0] && (
            <span
              className="px-2 py-[3px] rounded-[5px] text-[10.5px] font-semibold"
              style={{ background: "rgba(59,130,246,0.12)", color: "#6BA3F5" }}
            >
              {task.tags[0]}
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <p className="text-[13px] font-semibold text-[#D8D8E4] leading-[1.4] mb-[11px] tracking-[-0.01em]">
          {task.title}
        </p>

        {/* ── Meta ── */}
        <div className="flex items-center gap-[10px] mb-[13px]">
          <span className="flex items-center gap-[4px] text-[10.5px] text-[#3A3A4A]">
            <CornerDownRight size={9} />
          </span>
          <span className="flex items-center gap-[4px] text-[10.5px] text-[#3A3A4A]">
            <MessageSquare size={9} />
            <span>{task.comments}</span>
          </span>
          <span className="flex items-center gap-[4px] text-[10.5px] text-[#3A3A4A]">
            <Paperclip size={9} />
            <span>{task.attachments}</span>
          </span>
          <span className="flex items-center gap-[4px] text-[10.5px] text-[#3A3A4A]">
            <Clock size={9} />
            <span>{task.daysLeft} dias</span>
          </span>
        </div>

        {/* ── Progress + Avatars ── */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="flex-1 h-[4px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #3A56E4 0%, #7038E8 100%)" }}
              />
            </div>
            <span className="text-[10.5px] text-[#3A3A4A] shrink-0 tabular-nums font-medium">
              {task.progress}&nbsp;/&nbsp;{task.progressTotal}
            </span>
          </div>
          <MemberStack members={task.members} max={2} />
        </div>
      </motion.div>
    </div>
  );
}
