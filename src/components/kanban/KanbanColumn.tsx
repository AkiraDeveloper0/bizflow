"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  accentColor: string;
  tasks: Task[];
}

export function KanbanColumn({ status, label, accentColor, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-[272px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-[10px] px-[2px]">
        <div className="flex items-center gap-2">
          <div
            className="w-[3px] h-[15px] rounded-full"
            style={{ background: accentColor }}
          />
          <span className="text-[12.5px] font-semibold text-[#C0C0CC] tracking-[-0.01em]">
            {label}
          </span>
          <span
            className="text-[10px] font-semibold px-[6px] py-[2px] rounded-[4px] tabular-nums"
            style={{ background: "rgba(255,255,255,0.055)", color: "#48485A" }}
          >
            {tasks.length}
          </span>
        </div>
        <button className="w-[22px] h-[22px] flex items-center justify-center rounded-[5px] text-[#2C2C3A] hover:text-[#5A5A6A] hover:bg-white/[0.04] transition-all">
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Body */}
      <div
        ref={setNodeRef}
        className="flex-1 rounded-[11px] p-[5px] min-h-[160px] transition-all duration-150"
        style={{
          background: isOver ? "rgba(67,97,238,0.04)" : "transparent",
          border: isOver ? "1.5px dashed rgba(67,97,238,0.25)" : "1.5px dashed transparent",
        }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-[8px]">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        <button className="w-full flex items-center gap-[7px] mt-[10px] px-3 py-2 rounded-[9px] text-[11px] text-[#2C2C3A] hover:text-[#555568] hover:bg-white/[0.025] transition-all">
          <Plus size={11} />
          <span>Adicionar task</span>
        </button>
      </div>
    </div>
  );
}
