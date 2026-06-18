import { useAuth } from "@clerk/react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

const TYPE_ICONS: Record<string, string> = { report:"◈", contract:"◆", invoice:"◉", other:"◎" };
const TYPE_COLORS: Record<string, string> = { report:"#06b6d4", contract:"#D4AF37", invoice:"#00ff88", other:"#3a5570" };

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

      // 1. Request presigned upload URL
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ filename: selectedFile.name, contentType: selectedFile.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, objectPath } = await urlRes.json();

      // 2. Upload directly to GCS
      setUploadProgress(30);
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      if (!putRes.ok) throw new Error("Upload failed");
      setUploadProgress(80);

      // 3. Save document record
      const saveRes = await fetch("/api/portal/documents/client-upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uploadName || selectedFile.name,
          type: uploadType,
          description: uploadDesc || null,
          fileUrl: objectPath,
          mimeType: selectedFile.type,
          fileSize: String(selectedFile.size),
        }),
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

  const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";
  const inputCls = "w-full bg-[#030810] border border-[#0d1b35] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono placeholder:text-[#2a4060] transition-colors";
  const labelCls = "block text-[9px] font-mono text-[#3a5570] mb-1.5 uppercase tracking-widest";
  const filtered = filter === "all" ? docs : docs.filter(d => d.type === filter);

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal"><img src="/logo.jpg" alt="Dantès" className="w-9 h-9 object-contain rounded-sm" /></Link>
          <div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em]">BLOOM SOCIETY PORTAL</p>
            <p className="text-white font-serif font-bold text-sm">Documents & Reports</p>
          </div>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
          ↑ UPLOAD FILE
        </button>
      </header>

      <nav className="relative z-10 border-b border-[#0d1b35] px-6 flex gap-0">
        {[{href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},{href:"/portal/billing",l:"BILLING"}].map(i=>(
          <Link key={i.href} href={i.href} className={`px-4 py-3 text-[10px] font-mono border-b-2 transition-all ${i.href==="/portal/documents"?"text-[#D4AF37] border-[#D4AF37]":"text-[#3a5570] border-transparent hover:text-white hover:border-[#D4AF37]/40"}`}>{i.l}</Link>
        ))}
      </nav>

      {showUpload && (
        <div className="fixed inset-0 bg-[#030810]/90 flex items-center justify-center z-50 px-6">
          <form onSubmit={uploadFile} className={`${panelCls} p-7 w-full max-w-lg space-y-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">UPLOAD A DOCUMENT</p>
              <button type="button" onClick={() => { setShowUpload(false); setSelectedFile(null); setUploadError(""); }} className="text-[#3a5570] hover:text-white text-lg font-mono">×</button>
            </div>

            <div>
              <label className={labelCls}>Select File *</label>
              <div
                className="border-2 border-dashed border-[#0d1b35] rounded-sm p-8 text-center cursor-pointer hover:border-[#D4AF37]/30 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {selectedFile ? (
                  <div>
                    <p className="text-[#D4AF37] font-mono text-xs mb-1">{selectedFile.name}</p>
                    <p className="text-[#3a5570] text-[9px] font-mono">{formatBytes(String(selectedFile.size))}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#3a5570] text-xs font-mono mb-1">Click to select a file</p>
                    <p className="text-[#2a4060] text-[9px] font-mono">PDF, DOCX, XLSX, PNG, JPG and more</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" className="hidden" onChange={onFileSelected} />
            </div>

            <div><label className={labelCls}>Document Name</label><input value={uploadName} onChange={e=>setUploadName(e.target.value)} className={inputCls} placeholder="e.g. Q3 Financial Report" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Type</label>
                <select value={uploadType} onChange={e=>setUploadType(e.target.value)} className={inputCls}>
                  {["report","contract","invoice","other"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Description</label><input value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} className={inputCls} placeholder="Optional note..." /></div>
            </div>

            {uploadProgress > 0 && (
              <div>
                <div className="h-1 bg-[#0d1b35] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-[9px] font-mono text-[#3a5570] mt-1">{uploadProgress < 80 ? "Uploading..." : uploadProgress < 100 ? "Saving..." : "Done!"}</p>
              </div>
            )}
            {uploadError && <p className="text-red-400 text-xs font-mono">{uploadError}</p>}
            <button type="submit" disabled={uploading || !selectedFile} className="w-full py-3 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest">
              {uploading ? "UPLOADING..." : "UPLOAD →"}
            </button>
          </form>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {["all","report","contract","invoice","other"].map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 text-[10px] font-mono rounded-sm border transition-colors capitalize ${filter===f?"bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]":"bg-[#040c1a] border-[#0d1b35] text-[#3a5570] hover:text-white"}`}>
                {f}
              </button>
            ))}
          </div>
          <p className="text-[9px] font-mono text-[#3a5570]">{docs.length} FILE{docs.length !== 1 ? "S" : ""}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING...</span></div>
        ) : filtered.length === 0 ? (
          <div className={`${panelCls} p-16 text-center`}>
            <p className="text-[#D4AF37] font-mono text-2xl mb-3">◈</p>
            <p className="text-white font-semibold mb-2">No documents yet</p>
            <p className="text-[#3a5570] text-sm mb-6">Your Graham deposits reports and files here. You can also upload your own documents.</p>
            <button onClick={() => setShowUpload(true)} className="px-5 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold rounded-sm hover:bg-[#D4AF37]/20 transition-colors tracking-widest">↑ UPLOAD FILE</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(d => (
              <div key={d.id} className={`${panelCls} p-5 hover:border-[#D4AF37]/20 transition-colors`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-sm bg-[#030810] border border-[#0d1b35] flex items-center justify-center shrink-0 text-base"
                    style={{ color: TYPE_COLORS[d.type] ?? "#D4AF37" }}>
                    {TYPE_ICONS[d.type] ?? "◎"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-0.5 truncate">{d.name}</p>
                    <p className="text-[10px] font-mono capitalize mb-1" style={{ color: TYPE_COLORS[d.type] ?? "#D4AF37" }}>{d.type}{d.fileSize ? ` · ${formatBytes(d.fileSize)}` : ""}</p>
                    {d.description && <p className="text-[10px] text-[#3a5570] leading-relaxed line-clamp-2">{d.description}</p>}
                    {d.mimeType && <p className="text-[8px] font-mono text-[#2a4060] mt-0.5">{d.mimeType}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0d1b35]">
                  <p className="text-[9px] font-mono text-[#2a4060]">{new Date(d.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-mono text-[#3a5570]">{d.uploadedBy === "system" ? "Graham" : d.uploadedBy.includes("@") ? "You" : "Bloom Society"}</p>
                    {d.fileUrl && (
                      <a href={`/api/storage/objects${d.fileUrl}`} target="_blank" rel="noreferrer"
                        className="text-[9px] font-mono text-[#D4AF37] hover:text-white transition-colors border border-[#D4AF37]/30 px-2 py-0.5 rounded-sm">
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
