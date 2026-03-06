"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, Project, Empresa, TaskStatus, ViewMode, Priority, Area } from "@/types";
import { TASKS, PROJECTS, EMPRESAS } from "./mockData";

interface TaskFilters {
  priorities: Priority[];
  categories: Area[];
}

interface AppState {
  // Data
  tasks: Task[];
  projects: Project[];
  empresas: Empresa[];

  // UI State
  activePage: string;
  activeProjectId: string | null;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  taskFilters: TaskFilters;

  // Actions
  setActivePage: (page: string) => void;
  setActiveProject: (projectId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  addEmpresa: (empresa: Empresa) => void;
  addProject: (project: Project) => void;
  setTaskFilters: (filters: TaskFilters) => void;
  resetTaskFilters: () => void;
}

const DEFAULT_FILTERS: TaskFilters = { priorities: [], categories: [] };

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: TASKS,
      projects: PROJECTS,
      empresas: EMPRESAS,

      activePage: "projetos",
      activeProjectId: "p1",
      viewMode: "kanban",
      sidebarCollapsed: false,
      taskFilters: DEFAULT_FILTERS,

      setActivePage: (page) => set({ activePage: page }),
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      moveTask: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          ),
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        })),

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      addEmpresa: (empresa) =>
        set((state) => ({ empresas: [...state.empresas, empresa] })),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      setTaskFilters: (filters) => set({ taskFilters: filters }),

      resetTaskFilters: () => set({ taskFilters: DEFAULT_FILTERS }),
    }),
    {
      name: "bizflow-storage",
      partialize: (state) => ({
        activePage: state.activePage,
        activeProjectId: state.activeProjectId,
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed,
        tasks: state.tasks,
        taskFilters: state.taskFilters,
      }),
    }
  )
);
