import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AffiliateIQ — NovaSaaS Co.",
  description: "Affiliate Performance Intelligence Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col h-screen overflow-hidden">
        <DemoModeBanner />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
