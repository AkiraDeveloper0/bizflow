"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@excalidraw/excalidraw/index.css";

// Excalidraw must be loaded client-side only (no SSR)
const Excalidraw = dynamic(
  async () => {
    const { Excalidraw } = await import("@excalidraw/excalidraw");
    return Excalidraw;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center h-full w-full"
        style={{ background: "#13131A" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(67,97,238,0.25) 0%, rgba(124,58,237,0.25) 100%)",
              border: "1px solid rgba(67,97,238,0.25)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C8FF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <p className="text-[13px] text-[#5A5A68] font-medium">Carregando Quadro…</p>
        </div>
      </div>
    ),
  }
);

export function ExcalidrawPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-full w-full" style={{ background: "#13131A" }}>
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-6"
        style={{
          height: "56px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "#0F0F13",
        }}
      >
        <div
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(67,97,238,0.2) 0%, rgba(124,58,237,0.2) 100%)",
            border: "1px solid rgba(67,97,238,0.2)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C8FF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[14px] font-semibold text-[#EDEDED] tracking-[-0.015em]">
            Quadro
          </h1>
          <p className="text-[11px] text-[#4A4A58]">
            Workspace / Quadro
          </p>
        </div>
      </div>

      {/* Excalidraw Canvas */}
      <div className="flex-1 min-h-0 w-full">
        {mounted && (
          <Excalidraw
            theme="dark"
            UIOptions={{
              canvasActions: {
                saveToActiveFile: true,
                loadScene: true,
                export: { saveFileToDisk: true },
                toggleTheme: true,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
