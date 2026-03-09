"use client";

import { useEffect, useState } from "react";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "#060608" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-[#4361EE] border-t-transparent animate-spin"
        />
      </div>
    );
  }

  return <>{children}</>;
}
