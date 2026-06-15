"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on resize to md+
  useEffect(() => {
    function onResize() { if (window.innerWidth >= 768) setMobileOpen(false); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop sidebar — always visible md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.65)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 md:hidden"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Sidebar onCloseMobile={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0" style={{ background: "var(--bg)" }}>
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 h-12 border-b md:hidden shrink-0" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 rounded-lg border flex items-center justify-center"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>AffiliateIQ</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
