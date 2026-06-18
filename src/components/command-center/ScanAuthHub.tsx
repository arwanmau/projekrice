import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useDesk } from "./desk-context";
import { GlassPanel } from "./GlassPanel";
import { QrCode, ScanLine, CheckCircle2 } from "lucide-react";

const LOGS = [
  {
    batch: "1042",
    status: "Batch #1042 Terverifikasi",
    origin: "Geographic Origin Authenticated · Vietnam Plant",
    hash: "7xKp9Fm2aBc88Ef3Cc44e9F0",
    geo: "Ho Chi Minh · VN",
  },
  {
    batch: "1041",
    status: "Batch #1041 Terverifikasi",
    origin: "Geographic Origin Authenticated · Jatiwangi Farm",
    hash: "3aBc88Ef7xKp9Fm2aBc44e9",
    geo: "Karawang · ID",
  },
];

export function ScanAuthHub() {
  const { setHighlightNode } = useDesk();

  useEffect(() => {
    setHighlightNode("plant");
    const t = setTimeout(() => setHighlightNode("farm"), 6000);
    return () => clearTimeout(t);
  }, [setHighlightNode]);

  return (
    <GlassPanel
      glow
      title="Pusat Pemindaian Data & Otentikasi"
      subtitle="Scan Hub · Pindai QR Kode Batch"
      icon={<QrCode className="h-4 w-4 text-cc-accent" />}
      className="cc-module-scan"
    >
      <div className="grid gap-4 p-4 lg:grid-cols-[200px_1fr]">
        <div className="cc-forensic-chamber relative flex flex-col items-center justify-center rounded-xl border border-cc-accent/20 p-4">
          <div className="cc-multi-laser absolute inset-0 overflow-hidden rounded-xl" aria-hidden />
          <div className="cc-chip-scan relative z-10 grid h-24 w-24 place-items-center rounded-lg border-2 border-cc-accent/40 bg-black/50">
            <div className="text-center font-mono text-[10px] font-bold text-cc-accent">#1042</div>
            <ScanLine className="absolute h-full w-full text-cc-accent/20" />
          </div>
          <p className="relative z-10 mt-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            3D Chip · Multi-Laser Auth
          </p>
          <Link to="/scan" className="relative z-10 mt-2 text-[10px] text-cc-accent hover:underline">
            Buka pemindai penuh →
          </Link>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-cc-accent">Scan Results</div>
          <ul className="mt-2 space-y-2">
            {LOGS.map((log) => (
              <li
                key={log.batch}
                className="cc-log-line rounded-lg border border-white/5 px-3 py-2 text-xs"
                onMouseEnter={() => setHighlightNode(log.batch === "1042" ? "plant" : "farm")}
              >
                <div className="flex items-center gap-1.5 font-semibold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {log.status}
                </div>
                <div className="mt-1 text-muted-foreground">{log.origin}</div>
                <div className="mt-0.5 font-mono text-[10px] text-cc-accent">
                  On-Chain Verifikasi Hash: {log.hash.slice(0, 12)}…
                </div>
                <div className="text-[10px] text-muted-foreground">{log.geo}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassPanel>
  );
}
