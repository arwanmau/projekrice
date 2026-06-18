import { useBatches } from "@/lib/batches-context";
import { useDesk } from "./desk-context";
import { GlassPanel } from "./GlassPanel";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function IntegratedLedger() {
  const { batches } = useBatches();
  const { routeOptimized } = useDesk();
  const rows = batches.slice(0, 6);

  return (
    <GlassPanel
      glow
      title="On-Chain Supply Chain Ledger (Terintegrasi)"
      subtitle="Tap data untuk riwayat detail"
      icon={<ShieldCheck className="h-4 w-4 text-cc-accent" />}
      className="cc-module-ledger"
    >
      <div className="overflow-x-auto p-2">
        <table className="w-full min-w-[560px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-white/5 text-muted-foreground">
              <th className="px-2 py-2 font-semibold">ID Batch</th>
              <th className="px-2 py-2 font-semibold">Produk</th>
              <th className="px-2 py-2 font-semibold">Tahap</th>
              <th className="px-2 py-2 font-semibold">Status</th>
              <th className="px-2 py-2 font-semibold">Scan Hash</th>
              <th className="px-2 py-2 font-semibold">AI Routing</th>
              <th className="px-2 py-2 font-semibold">Rute</th>
              <th className="px-2 py-2 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr
                key={b.id}
                className="cc-table-row cursor-pointer border-b border-white/5"
                onClick={() =>
                  toast.info(`Batch ${b.id}`, { description: "Riwayat on-chain · ketuk untuk detail penuh." })
                }
              >
                <td className="px-2 py-2 font-mono font-semibold text-cc-accent">#{b.id}</td>
                <td className="px-2 py-2">{b.product}</td>
                <td className="px-2 py-2">
                  {b.status === "Harvested" ? "Panen" : b.status === "In Transit" ? "Distribusi" : b.status}
                </td>
                <td className="px-2 py-2">
                  <span className="inline-flex items-center gap-1 text-success">
                    <CheckCircle2 className="h-3 w-3" /> Verifikasi Sukses
                  </span>
                </td>
                <td className="max-w-[80px] truncate px-2 py-2 font-mono text-[10px]">
                  {b.txHash.slice(0, 14)}…
                </td>
                <td className="px-2 py-2">
                  <span className={routeOptimized ? "text-cc-accent" : "text-amber-400"}>
                    {routeOptimized ? "Optimal" : "Review"}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <MiniRoute optimal={routeOptimized} />
                </td>
                <td className="px-2 py-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[9px] border-cc-accent/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Batch ${b.id} diverifikasi on-chain`);
                    }}
                  >
                    Verify Batch
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}

function MiniRoute({ optimal }: { optimal: boolean }) {
  return (
    <svg viewBox="0 0 48 12" className="h-3 w-12">
      <path
        d="M 2 8 Q 24 2 46 6"
        fill="none"
        stroke={optimal ? "oklch(0.78 0.16 175)" : "oklch(0.72 0.18 55)"}
        strokeWidth="1"
        className="cc-route-pulse"
      />
    </svg>
  );
}
