import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider" 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cockpit MJ",
  description: "Gestionnaire de JDR Next Gen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider> {/* <-- ICI */}
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}