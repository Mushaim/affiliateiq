"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-24 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(220,38,38,0.1)" }}>
        <AlertTriangle size={22} style={{ color: "var(--danger)" }} />
      </div>
      <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text)" }}>Something went wrong</h2>
      <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--muted)" }}>
        {error.message ?? "An unexpected error occurred. The error has been logged."}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <RefreshCw size={13} /> Try again
      </button>
    </div>
  );
}
