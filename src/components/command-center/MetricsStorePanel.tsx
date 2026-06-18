import { useBatches } from "@/lib/batches-context";
import { GlassPanel } from "./GlassPanel";
import { Activity, Package, ShieldCheck, TrendingUp, Store } from "lucide-react";

export function MetricsStorePanel() {
  const { batches } = useBatches();
  const stats = [
    { label: "Batch Aktif", en: "Active Batches", value: batches.length, Icon: Package, pct: 65 },
    {
      label: "Event On-Chain",
      en: "On-Chain Events",
      value: batches.reduce((a, b) => a + b.timeline.length, 0),
      Icon: Activity,
      pct: 82,
    },
    {
      label: "Asal Terverifikasi",
      en: "Verified Origins",
      value: new Set(batches.map((b) => b.origin.country)).size,
      Icon: ShieldCheck,
      pct: 55,
    },
    {
      label: "Throughput (T)",
      en: "Throughput (ton)",
      value: Math.round(batches.reduce((a, b) => a + b.weightKg, 0) / 1000),
      Icon: TrendingUp,
      pct: 74,
    },
  ];

  const throughputMonths = [42, 48, 52, 58, 65, 72, 78, 85];

  return (
    <GlassPanel
      title="Analisis Interaktif Toko & Metrik Kunci"
      subtitle="Store Analysis · Key Metrics"
      icon={<Store className="h-4 w-4 text-cc-accent" />}
      className="cc-module-metrics"
    >
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div className="flex justify-around gap-2 sm:flex-col sm:justify-start">
          {stats.map((s) => (
            <div key={s.label} className="cc-pillar flex flex-col items-center">
              <div className="cc-pillar-bar relative w-10 overflow-hidden rounded-t-md bg-white/5" style={{ height: 72 }}>
                <div
                  className="cc-pillar-fill absolute bottom-0 w-full rounded-t-md"
                  style={{ height: `${s.pct}%` }}
                />
              </div>
              <s.Icon className="mt-1 h-3 w-3 text-cc-accent" />
              <div className="mt-1 text-center font-mono text-sm font-bold text-cc-accent">{s.value}</div>
              <div className="text-center text-[8px] font-semibold uppercase text-muted-foreground">{s.label}</div>
              <div className="text-center text-[8px] text-muted-foreground">{s.en}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-cc-accent">
            Throughput (ton) · Analisis Toko
          </div>
          <p className="text-[9px] text-muted-foreground">Terhubung ke AI Demand-Supply Analyser</p>
          <div className="mt-3 flex h-24 items-end gap-1">
            {throughputMonths.map((h, i) => (
              <div
                key={i}
                className="cc-bar cc-bar--throughput flex-1 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[8px] text-muted-foreground">
            <span>Jan</span>
            <span>Agt</span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
