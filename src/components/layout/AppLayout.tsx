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

      <div
        className="min-h-screen w-full flex items-center justify-center p-4 md:p-6"
        style={{ background: "#060608" }}
      >
        {/* Main App Container */}
        <div
          className="w-full max-w-[1440px] h-[calc(100vh-48px)] min-h-[600px] flex rounded-[20px] overflow-hidden"
          style={{
            background: "#0A0A0D",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.055)",
          }}
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
