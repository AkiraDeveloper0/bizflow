"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, HelpCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { DashboardPage } from "./pages/DashboardPage";
import { EmpresasPage } from "./pages/EmpresasPage";
import { ProjetosPage } from "./pages/ProjetosPage";
import { TasksPage } from "./pages/TasksPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { BuscarPage } from "./pages/BuscarPage";
import { AIPage } from "./pages/AIPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { NotificacoesPage } from "./pages/NotificacoesPage";
import { EmpresaDetailPage } from "./pages/EmpresaDetailPage";
import { CalendarioPage } from "./pages/CalendarioPage";
import { ConfiguracoesPage } from "./pages/ConfiguracoesPage";
import { ExcalidrawPage } from "./pages/ExcalidrawPage";
import { ExtensionsPage } from "./pages/ExtensionsPage";

export function MainContent() {
  const { activePage } = useAppStore();

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage key="dashboard" />;
      case "empresas":
        return <EmpresasPage key="empresas" />;
      case "projetos":
        return <ProjetosPage key="projetos" />;
      case "tasks":
        return <TasksPage key="tasks" />;
      case "search":
      case "buscar":
        return <BuscarPage key="buscar" />;
      case "ai":
        return <AIPage key="ai" />;
      case "templates":
        return <TemplatesPage key="templates" />;
      case "notificacoes":
        return <NotificacoesPage key="notificacoes" />;
      case "empresa-detail":
        return <EmpresaDetailPage key="empresa-detail" />;
      case "calendario":
        return <CalendarioPage key="calendario" />;
      case "relatorios":
        return (
          <PlaceholderPage
            key="relatorios"
            title="Relatórios"
            description="Análises e métricas do seu workspace"
            icon={BarChart3}
            color="#7C3AED"
            breadcrumb="Workspace / Relatórios"
          />
        );
      case "extensoes":
        return <ExtensionsPage key="extensoes" />;
      case "quadro":
        return <ExcalidrawPage key="quadro" />;
      case "configuracoes":
        return <ConfiguracoesPage key="configuracoes" />;
      case "ajuda":
        return (
          <PlaceholderPage
            key="ajuda"
            title="Ajuda & Central"
            description="Documentação e suporte"
            icon={HelpCircle}
            color="#059669"
            breadcrumb="Workspace / Ajuda"
          />
        );
      default:
        return <ProjetosPage key="projetos" />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="flex-1 h-full overflow-hidden"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
