import { useAuth } from "@clerk/react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

const TYPE_ICONS: Record<string, string> = { report:"◈", contract:"◆", invoice:"◉", other:"◎" };
const TYPE_COLORS: Record<string, string> = { report:"#a855f7", contract:"#22d3ee", invoice:"#00c45a", other:"#9898b8" };

const P = {
  bg: "#f5f0ff", heading: "#1e1b4b", body: "#5a587a", muted: "#9898b8", purple: "#a855f7",
  card: "rgba(255,255,255,0.68)", cardBorder: "rgba(168,85,247,0.18)",
};

type Doc = { id:number; name:string; type:string; description:string|null; uploadedBy:string; fileUrl:string|null; mimeType:string|null; fileSize:string|null; createdAt:string };

function formatBytes(b: string | null): string {
  if (!b) return "";
  const n = parseInt(b);
  if (isNaN(n)) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalDocumentsPage() {
  const { getToken } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("report");
  const [uploadDesc, setUploadDesc] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function load() {
    const token = await getToken();
    const res = await fetch("/api/portal/documents", { headers: { Authorization:`Bearer ${token}` } });
    if (res.ok) setDocs(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    if (!uploadName) setUploadName(f.name.replace(/\.[^.]+$/, ""));
  }

  async function uploadFile(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true); setUploadError(""); setUploadProgress(0);
    try {
      const token = await getToken();
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ filename: selectedFile.name, contentType: selectedFile.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, objectPath } = await urlRes.json();
      setUploadProgress(30);
      const putRes = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": selectedFile.type }, body: selectedFile });
      if (!putRes.ok) throw new Error("Upload failed");
      setUploadProgress(80);
      const saveRes = await fetch("/api/portal/documents/client-upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: uploadName || selectedFile.name, type: uploadType, description: uploadDesc || null, fileUrl: objectPath, mimeType: selectedFile.type, fileSize: String(selectedFile.size) }),
      });
      if (!saveRes.ok) throw new Error("Failed to save document record");
      const newDoc = await saveRes.json();
      setUploadProgress(100);
      setDocs(d => [newDoc, ...d]);
      setShowUpload(false);
      setSelectedFile(null); setUploadName(""); setUploadDesc(""); setUploadType("report");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally { setUploading(false); setUploadProgress(0); }
  }

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono";
  const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: P.heading };
  const labelCls = "block text-[9px] font-mono mb-1.5 uppercase tracking-widest";
  const filtered = filter === "all" ? docs : docs.filter(d => d.type === filter);

  const navLinks = [
    {href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},
    {href:"/portal/billing",l:"BILLING"},{href:"/portal/club",l:"✦ CLUB ROOM"}
  ];

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 20% 0%,rgba(34,211,238,0.06),transparent),radial-gradient(ellipse 60% 60% at 80% 100%,rgba(168,85,247,0.07),transparent)" }} />

      <header className="relative z-10 border-b px-4 sm:px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <div className="flex items-center gap-4">
          <Link href="/portal"><img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" /></Link>
          <div>
            <p className="text-[9px] font-mono tracking-[0.3em]" style={{ color: P.purple }}>BLOOM SOCIETY PORTAL</p>
            <p className="font-serif font-bold text-sm" style={{ color: P.heading }}>Documents & Reports</p>
          </div>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="px-4 py-2 rounded-xl text-[10px] font-mono font-bold text-white transition-all tracking-widest"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          ↑ UPLOAD FILE
        </button>
      </header>

      <nav className="relative z-10 border-b px-4 sm:px-6 flex gap-0 overflow-x-auto" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderColor: "rgba(168,85,247,0.12)" }}>
        {navLinks.map(i=>(
          <Link key={i.href} href={i.href}
            className="px-4 py-3 text-[10px] font-mono border-b-2 transition-all whitespace-nowrap"
            style={i.href==="/portal/documents" ? { color: P.purple, borderColor: P.purple } : { color: P.muted, borderColor: "transparent" }}>
            {i.l}
          </Link>
        ))}
      </nav>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background: "rgba(30,27,75,0.5)", backdropFilter: "blur(8px)" }}>
          <form onSubmit={uploadFile} className="rounded-2xl p-7 w-full max-w-lg space-y-4" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 32px 80px rgba(168,85,247,0.2)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono tracking-widest" style={{ color: P.purple }}>UPLOAD A DOCUMENT</p>
              <button type="button" onClick={() => { setShowUpload(false); setSelectedFile(null); setUploadError(""); }} className="text-lg font-mono transition-colors" style={{ color: P.muted }}>×</button>
            </div>
            <div>
              <label className={labelCls} style={{ color: P.muted }}>Select File *</label>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-purple-300"
                style={{ borderColor: "rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.03)" }}
                onClick={() => fileRef.current?.click()}>
                {selectedFile ? (
                  <div>
                    <p className="font-mono text-xs mb-1" style={{ color: P.purple }}>{selectedFile.name}</p>
                    <p className="text-[9px] font-mono" style={{ color: P.muted }}>{formatBytes(String(selectedFile.size))}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-mono mb-1" style={{ color: P.body }}>Click to select a file</p>
                    <p className="text-[9px] font-mono" style={{ color: P.muted }}>PDF, DOCX, XLSX, PNG, JPG and more</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" className="hidden" onChange={onFileSelected} />
            </div>
            <div>
              <label className={labelCls} style={{ color: P.muted }}>Document Name</label>
              <input value={uploadName} onChange={e=>setUploadName(e.target.value)} className={inputCls} style={inputStyle} placeholder="e.g. Q3 Financial Report" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} style={{ color: P.muted }}>Type</label>
                <select value={uploadType} onChange={e=>setUploadType(e.target.value)} className={inputCls} style={inputStyle}>
                  {["report","contract","invoice","other"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: P.muted }}>Note (optional)</label>
                <input value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} className={inputCls} style={inputStyle} placeholder="Short description..." />
              </div>
            </div>
            {uploadProgress > 0 && (
              <div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(168,85,247,0.12)" }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width:`${uploadProgress}%`, background: "linear-gradient(90deg,#22d3ee,#a855f7)" }} />
                </div>
                <p className="text-[9px] font-mono mt-1" style={{ color: P.muted }}>{uploadProgress < 80 ? "Uploading..." : uploadProgress < 100 ? "Saving..." : "Done!"}</p>
              </div>
            )}
            {uploadError && <p className="text-red-500 text-xs font-mono">{uploadError}</p>}
            <button type="submit" disabled={uploading || !selectedFile} className="w-full py-3 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-50 tracking-widest"
              style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
              {uploading ? "UPLOADING..." : "UPLOAD →"}
            </button>
          </form>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {["all","report","contract","invoice","other"].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className="px-3 py-1.5 text-[10px] font-mono rounded-xl transition-all capitalize"
                style={filter===f
                  ? { background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(168,85,247,0.2)", color: P.body }
                }>
                {f}
              </button>
            ))}
          </div>
          <p className="text-[9px] font-mono" style={{ color: P.muted }}>{docs.length} FILE{docs.length !== 1 ? "S" : ""}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-mono text-xs animate-pulse" style={{ color: P.purple }}>LOADING...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
            <p className="font-mono text-2xl mb-3" style={{ color: P.purple }}>◈</p>
            <p className="font-semibold mb-2" style={{ color: P.heading }}>No documents yet</p>
            <p className="text-sm mb-6" style={{ color: P.body }}>Your Graham deposits reports and files here. You can also upload your own documents.</p>
            <button onClick={() => setShowUpload(true)}
              className="px-5 py-2.5 rounded-xl text-[10px] font-mono font-bold text-white transition-all tracking-widest"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              ↑ UPLOAD FILE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(d => (
              <div key={d.id} className="rounded-2xl p-5 hover:shadow-md transition-all" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                    style={{ background: (TYPE_COLORS[d.type] ?? P.purple) + "15", border: `1px solid ${(TYPE_COLORS[d.type] ?? P.purple)}30`, color: TYPE_COLORS[d.type] ?? P.purple }}>
                    {TYPE_ICONS[d.type] ?? "◎"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5 truncate" style={{ color: P.heading }}>{d.name}</p>
                    <p className="text-[10px] font-mono capitalize mb-1" style={{ color: TYPE_COLORS[d.type] ?? P.purple }}>
                      {d.type}{d.fileSize ? ` · ${formatBytes(d.fileSize)}` : ""}
                    </p>
                    {d.description && <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: P.body }}>{d.description}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
                  <p className="text-[9px] font-mono" style={{ color: P.muted }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-mono" style={{ color: P.muted }}>{d.uploadedBy === "system" ? "Graham" : d.uploadedBy.includes("@") ? "You" : "Bloom Society"}</p>
                    {d.fileUrl && (
                      <a href={`/api/storage/objects${d.fileUrl}`} target="_blank" rel="noreferrer"
                        className="text-[9px] font-mono px-2 py-0.5 rounded-lg border transition-colors"
                        style={{ color: P.purple, borderColor: "rgba(168,85,247,0.3)" }}>
                        ↓ DOWNLOAD
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
