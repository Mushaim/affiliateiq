import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-24 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 font-black text-2xl"
        style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent)" }}
      >
        404
      </div>
      <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text)" }}>Page not found</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        This page doesn&apos;t exist in the affiliate program.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Back to Command Center
      </Link>
    </div>
  );
}
