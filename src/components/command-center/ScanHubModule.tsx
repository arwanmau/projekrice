import { useBatches } from "@/lib/batches-context";
import { GlassPanel } from "./GlassPanel";
import { QrCode, ScanLine, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const SCAN_LOG = [
  { id: "1042", status: "Batch #1042 Terverifikasi", origin: "Asal: Vietnam Plant", hash: "7xKp…9Fm2" },
  { id: "1041", status: "Batch #1041 Terverifikasi", origin: "Asal: Karawang Farm", hash: "3aBc…88Ef" },
];

export function ScanHubModule() {
  const { batches } = useBatches();
  const rows = batches.slice(0, 5);

  return (
    <GlassPanel
      glow
      title="Hub Pemindaian Data & Ledger"
      subtitle="Scan Hub · On-Chain Supply Chain Ledger"
      icon={<QrCode className="h-4 w-4 text-cc-accent" />}
      className="col-span-full"
    >
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(200px,280px)_1fr_1.2fr]">
        {/* QR hologram scanner */}
        <div className="cc-scanner flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="cc-qr-stage relative grid h-36 w-36 place-items-center">
            <div className="cc-qr-cube absolute inset-4 rounded-lg border-2 border-cc-accent/50 bg-white/5">
              <div className="absolute inset-2 grid grid-cols-4 grid-rows-4 gap-0.5 opacity-90">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className={`rounded-sm ${i % 3 === 0 ? "bg-cc-accent" : "bg-white/20"}`} />
                ))}
              </div>
            </div>
            <div className="cc-laser absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cc-accent to-transparent" />
            <ScanLine className="relative z-10 h-8 w-8 text-cc-accent opacity-80" />
          </div>
          <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Scan Hub · Holographic QR
          </p>
          <Link
            to="/scan"
            className="mt-2 text-xs font-medium text-cc-accent hover:underline"
          >
            Buka pemindai penuh →
          </Link>
        </div>

        {/* Scan results log */}
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cc-accent">Hasil Pindai</div>
          <ul className="mt-2 space-y-2">
            {SCAN_LOG.map((log) => (
              <li key={log.id} className="cc-log-line rounded-lg border border-white/5 px-2 py-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {log.status}
                </div>
                <div className="mt-0.5 text-muted-foreground">{log.origin}</div>
                <div className="mt-0.5 font-mono text-[10px] text-cc-accent">
                  On-Chain Hash: {log.hash}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Ledger table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
          <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-cc-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Supply Chain Ledger (On-Chain)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-white/5 text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">ID Batch</th>
                  <th className="px-3 py-2 font-semibold">Produk</th>
                  <th className="px-3 py-2 font-semibold">Tahap</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Rute</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id} className="cc-table-row border-b border-white/5 transition-colors">
                    <td className="px-3 py-2 font-mono font-semibold text-cc-accent">#{b.id.split("-")[1] ?? b.id}</td>
                    <td className="px-3 py-2">{b.product}</td>
                    <td className="px-3 py-2">{b.status === "Harvested" ? "Panen" : b.status === "In Transit" ? "Distribusi" : b.status}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1 text-success">
                        <CheckCircle2 className="h-3 w-3" /> Verifikasi Sukses
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <MiniRoute />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function MiniRoute() {
  return (
    <svg viewBox="0 0 48 12" className="h-3 w-12 opacity-80">
      <path d="M 2 8 Q 24 2 46 6" fill="none" stroke="oklch(0.78 0.16 175)" strokeWidth="1" className="cc-route-pulse" />
      <circle cx="2" cy="8" r="1.2" fill="oklch(0.78 0.16 175)" />
      <circle cx="46" cy="6" r="1.2" fill="oklch(0.72 0.14 195)" />
    </svg>
  );
}
