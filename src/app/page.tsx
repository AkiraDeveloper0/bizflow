"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MainContent } from "@/components/MainContent";
import { ClientProvider } from "@/components/ClientProvider";

export default function Home() {
  return (
    <ClientProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </ClientProvider>
  );
}
