"use client";

import { Sidebar } from "./Sidebar";
import { useAppStore } from "@/lib/store";
import { EventNotificationManager } from "@/components/EventNotificationManager";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <>
      {/* Global event notification popup — always mounted */}
      <EventNotificationManager />

      <div className="h-screen w-full flex">
        {/* Main App Container */}
        <div
          className="w-full h-full flex overflow-hidden"
          style={{ background: "#0A0A0D" }}
        >
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main
            className="flex-1 overflow-hidden flex flex-col"
            style={{ background: "#0C0C10" }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
