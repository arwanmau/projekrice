import { useDesk } from "./desk-context";
import { GlassPanel } from "./GlassPanel";
import { Brain, Cpu, GitBranch, BarChart3, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AICommandCore() {
  const { aiPulse, triggerRouteOptimize, routeOptimized } = useDesk();

  return (
    <GlassPanel
      glow
      title="AI Command Core"
      subtitle="Prediksi · Rute · Permintaan Terintegrasi"
      icon={<Brain className="h-4 w-4 text-cc-accent" />}
      className="cc-module-ai"
    >
      <div className="relative p-4">
        <div className="flex justify-center py-4">
          <div className="cc-ai-core relative grid h-20 w-20 place-items-center rounded-full" data-pulse={aiPulse}>
            <Cpu className="relative z-10 h-8 w-8 text-cc-accent" />
            <span className="cc-ai-core-ring absolute inset-0 rounded-full" />
            <span className="cc-ai-core-ring cc-ai-core-ring--2 absolute inset-[-8px] rounded-full" />
          </div>
        </div>

        <div className="space-y-3">
          <Panel
            title="Prediksi Gagal Panen Pintar"
            titleEn="Smart Harvest Prediction"
            Icon={Leaf}
            metric="Predicted Yield · Gagal Panen 3%"
            note="Sangat Rendah · risk tree L1"
          >
            <div className="cc-risk-tree mt-2 flex gap-1">
              {["L1", "L2", "L3"].map((l, i) => (
                <div
                  key={l}
                  className={`flex-1 rounded-sm py-2 text-center text-[9px] font-bold ${
                    i === 0 ? "bg-cc-accent/30 text-cc-accent" : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Optimalisasi Rute Terintegrasi"
            titleEn="Route Simulation & Optimization"
            Icon={GitBranch}
            metric={routeOptimized ? "Rute optimal · hijau aktif" : "Gangguan · simulasi ulang"}
            note="4.2d · $12.4k · CO₂ −9% vs 5.1d · $14.1k"
          >
            <div className="mt-2 flex gap-2">
              <svg viewBox="0 0 80 24" className="h-6 flex-1">
                <path
                  d="M 4 18 Q 40 4 76 8"
                  fill="none"
                  stroke={routeOptimized ? "oklch(0.78 0.16 175)" : "oklch(0.72 0.18 55)"}
                  strokeWidth="2"
                  className="cc-route-pulse"
                />
              </svg>
              <Button size="sm" variant="outline" className="h-6 text-[9px] px-2" onClick={triggerRouteOptimize}>
                Simulasikan
              </Button>
            </div>
          </Panel>

          <Panel
            title="Integrated Demand-Supply Analyser"
            titleEn="Analisis Permintaan · Analisis Toko"
            Icon={BarChart3}
            metric="Kenaikan Permintaan Beras +15%"
            note="Stok prediksi vs permintaan pasar"
          >
            <div className="mt-2 flex h-10 items-end gap-0.5">
              {[35, 48, 42, 58, 72, 88, 95].map((h, i) => (
                <div key={i} className="cc-bar flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </GlassPanel>
  );
}

function Panel({
  title,
  titleEn,
  Icon,
  metric,
  note,
  children,
}: {
  title: string;
  titleEn: string;
  Icon: typeof Brain;
  metric: string;
  note: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="cc-insight-card rounded-xl p-3">
      <div className="flex gap-2">
        <Icon className="h-4 w-4 shrink-0 text-cc-accent" />
        <div>
          <h3 className="text-[11px] font-bold">{title}</h3>
          <p className="text-[9px] text-muted-foreground">{titleEn}</p>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-cc-accent">{metric}</p>
      <p className="text-[10px] text-muted-foreground">{note}</p>
      {children}
    </article>
  );
}
