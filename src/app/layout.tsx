import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { NavbarWrapper } from "../components/layout/NavbarWrapper";

import { ThemeProvider } from "@/components/ThemeProvider" 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cockpit MJ",
  description: "Gestionnaire de JDR Next Gen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NavbarWrapper /> {/* <-- Utilise le wrapper ici */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}