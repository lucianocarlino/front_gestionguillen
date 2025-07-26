import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import SideNav from "@/components/side_nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestión de Inventario",
  description: "Sistema de gestión de inventario y órdenes de trabajo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`antialiased ${inter.className}`}>
        <div className="flex h-screen bg-background">
          <SideNav />
          <div className="w-full flex-1 p-6 overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
