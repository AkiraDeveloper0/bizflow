"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { getStatusColumns } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export function KanbanBoard() {
  const { tasks, moveTask, taskFilters } = useAppStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const columns = getStatusColumns();

  // Apply filters
  const filteredTasks = tasks.filter((t) => {
    if (
      taskFilters.priorities.length > 0 &&
      !taskFilters.priorities.includes(t.priority)
    )
      return false;
    if (
      taskFilters.categories.length > 0 &&
      !taskFilters.categories.includes(t.category)
    )
      return false;
    return true;
  });

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const currentTask = tasks.find((t) => t.id === activeId);
    if (!currentTask) return;

    const isOverColumn = columns.some((c) => c.id === overId);
    if (isOverColumn && currentTask.status !== overId) {
      moveTask(activeId, overId as TaskStatus);
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && currentTask.status !== overTask.status) {
      moveTask(activeId, overTask.status);
    }
  }

  function handleDragEnd(_event: DragEndEvent) {
    setActiveTask(null);
  }

  return (
    <DndContext
      id="bizflow-kanban"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 h-full overflow-x-auto pb-6 pr-2">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (t) => t.status === column.id
          );
          return (
            <KanbanColumn
              key={column.id}
              status={column.id}
              label={column.label}
              accentColor={column.accentColor}
              tasks={columnTasks}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div style={{ transform: "rotate(2deg)", opacity: 0.9 }}>
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
