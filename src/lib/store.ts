"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Task, Project, Empresa, TaskStatus, ViewMode, Priority, Area,
  Nota, EmpresaLogin, Ideia, FaturamentoEntry, EmpresaExtra,
} from "@/types";
import { TASKS, PROJECTS, EMPRESAS, DEFAULT_EMPRESAS_DATA } from "./mockData";

interface TaskFilters {
  priorities: Priority[];
  categories: Area[];
}

interface AppState {
  // Data
  tasks: Task[];
  projects: Project[];
  empresas: Empresa[];
  empresasData: Record<string, EmpresaExtra>;

  // UI State
  activePage: string;
  activeProjectId: string | null;
  activeEmpresaId: string | null;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  taskFilters: TaskFilters;

  // Actions — Navigation
  setActivePage: (page: string) => void;
  setActiveProject: (projectId: string | null) => void;
  setActiveEmpresaId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;

  // Actions — Tasks
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  setTaskFilters: (filters: TaskFilters) => void;
  resetTaskFilters: () => void;

  // Actions — Empresas & Projects
  addEmpresa: (empresa: Empresa) => void;
  updateEmpresa: (id: string, updates: Partial<Empresa>) => void;
  addProject: (project: Project) => void;

  // Actions — EmpresaExtra
  updateEmpresaExtra: (empresaId: string, data: Partial<EmpresaExtra>) => void;
  addNota: (empresaId: string, nota: Nota) => void;
  removeNota: (empresaId: string, notaId: string) => void;
  addLogin: (empresaId: string, login: EmpresaLogin) => void;
  removeLogin: (empresaId: string, loginId: string) => void;
  addIdeia: (empresaId: string, ideia: Ideia) => void;
  updateIdeia: (empresaId: string, ideiaId: string, updates: Partial<Ideia>) => void;
  removeIdeia: (empresaId: string, ideiaId: string) => void;
  addFaturamento: (empresaId: string, entry: FaturamentoEntry) => void;
  removeFaturamento: (empresaId: string, entryId: string) => void;
}

const DEFAULT_FILTERS: TaskFilters = { priorities: [], categories: [] };

const getEmpresaExtra = (state: AppState, empresaId: string): EmpresaExtra =>
  state.empresasData[empresaId] ?? {
    website: "", cnpj: "", telefone: "", endereco: "",
    notas: [], logins: [], ideias: [], faturamento: [],
  };

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: TASKS,
      projects: PROJECTS,
      empresas: EMPRESAS,
      empresasData: DEFAULT_EMPRESAS_DATA,

      activePage: "projetos",
      activeProjectId: "p1",
      activeEmpresaId: null,
      viewMode: "kanban",
      sidebarCollapsed: false,
      taskFilters: DEFAULT_FILTERS,

      setActivePage: (page) => set({ activePage: page }),
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
      setActiveEmpresaId: (id) => set({ activeEmpresaId: id }),
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

      setTaskFilters: (filters) => set({ taskFilters: filters }),
      resetTaskFilters: () => set({ taskFilters: DEFAULT_FILTERS }),

      addEmpresa: (empresa) =>
        set((state) => ({ empresas: [...state.empresas, empresa] })),

      updateEmpresa: (id, updates) =>
        set((state) => ({
          empresas: state.empresas.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      updateEmpresaExtra: (empresaId, data) =>
        set((state) => ({
          empresasData: {
            ...state.empresasData,
            [empresaId]: { ...getEmpresaExtra(state, empresaId), ...data },
          },
        })),

      addNota: (empresaId, nota) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, notas: [...extra.notas, nota] },
            },
          };
        }),

      removeNota: (empresaId, notaId) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, notas: extra.notas.filter((n) => n.id !== notaId) },
            },
          };
        }),

      addLogin: (empresaId, login) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, logins: [...extra.logins, login] },
            },
          };
        }),

      removeLogin: (empresaId, loginId) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, logins: extra.logins.filter((l) => l.id !== loginId) },
            },
          };
        }),

      addIdeia: (empresaId, ideia) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, ideias: [...extra.ideias, ideia] },
            },
          };
        }),

      updateIdeia: (empresaId, ideiaId, updates) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: {
                ...extra,
                ideias: extra.ideias.map((i) => (i.id === ideiaId ? { ...i, ...updates } : i)),
              },
            },
          };
        }),

      removeIdeia: (empresaId, ideiaId) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, ideias: extra.ideias.filter((i) => i.id !== ideiaId) },
            },
          };
        }),

      addFaturamento: (empresaId, entry) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: { ...extra, faturamento: [...extra.faturamento, entry] },
            },
          };
        }),

      removeFaturamento: (empresaId, entryId) =>
        set((state) => {
          const extra = getEmpresaExtra(state, empresaId);
          return {
            empresasData: {
              ...state.empresasData,
              [empresaId]: {
                ...extra,
                faturamento: extra.faturamento.filter((f) => f.id !== entryId),
              },
            },
          };
        }),
    }),
    {
      name: "bizflow-storage",
      partialize: (state) => ({
        activePage: state.activePage,
        activeProjectId: state.activeProjectId,
        activeEmpresaId: state.activeEmpresaId,
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed,
        tasks: state.tasks,
        taskFilters: state.taskFilters,
        empresas: state.empresas,
        empresasData: state.empresasData,
      }),
    }
  )
);
