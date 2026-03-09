import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizFlow — Organização Empresarial",
  description: "Workspace premium para gestão de empresas, projetos e tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
