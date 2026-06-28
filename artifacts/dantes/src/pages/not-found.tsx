import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#f5f0ff" }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
          <span className="font-serif font-black text-3xl" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>404</span>
        </div>
        <p className="text-[9px] font-mono tracking-[0.4em] mb-3" style={{ color: "#a855f7" }}>PAGE NOT FOUND</p>
        <h1 className="text-2xl font-serif font-black mb-3" style={{ color: "#1e1b4b" }}>Signal Lost</h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#5a587a" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/"
          className="inline-block px-6 py-2.5 rounded-full text-xs font-mono font-bold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)", boxShadow: "0 0 20px rgba(168,85,247,0.35)" }}>
          ← RETURN HOME
        </Link>
      </div>
    </div>
  );
}
