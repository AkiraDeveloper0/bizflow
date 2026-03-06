import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Priority, TaskStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityConfig(priority: Priority) {
  const configs = {
    high: {
      label: "High",
      dotColor: "#EF4444",
      bgColor: "rgba(239,68,68,0.12)",
      textColor: "#EF4444",
    },
    medium: {
      label: "Medium",
      dotColor: "#F97316",
      bgColor: "rgba(249,115,22,0.12)",
      textColor: "#F97316",
    },
    low: {
      label: "Low",
      dotColor: "#22C55E",
      bgColor: "rgba(34,197,94,0.12)",
      textColor: "#22C55E",
    },
  };
  return configs[priority];
}

export function getStatusConfig(status: TaskStatus) {
  const configs = {
    todo: { label: "To Do", color: "#4361EE" },
    in_progress: { label: "In Progress", color: "#7C3AED" },
    review: { label: "Review", color: "#F97316" },
    done: { label: "Done", color: "#22C55E" },
  };
  return configs[status];
}

export function getStatusColumns() {
  return [
    { id: "todo" as TaskStatus, label: "To Do", accentColor: "#4361EE" },
    { id: "in_progress" as TaskStatus, label: "In Progress", accentColor: "#7C3AED" },
    { id: "review" as TaskStatus, label: "Review", accentColor: "#F97316" },
    { id: "done" as TaskStatus, label: "Done", accentColor: "#22C55E" },
  ];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
