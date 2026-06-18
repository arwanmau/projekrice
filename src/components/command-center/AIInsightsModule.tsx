import { GlassPanel } from "./GlassPanel";
import { Brain, Cpu, TrendingUp, Route, BarChart3 } from "lucide-react";

export function AIInsightsModule() {
  return (
    <GlassPanel
      title="Wawasan Pintar AI"
      subtitle="AI Smart Insights · Neural analysis"
      icon={<Brain className="h-4 w-4 text-cc-accent" />}
      className="col-span-full lg:col-span-1"
    >
      <div className="flex items-center justify-center gap-2 border-b border-white/5 px-4 py-4">
        <span className="cc-chip-icon grid h-12 w-12 place-items-center rounded-xl">
          <Cpu className="h-6 w-6 text-cc-accent" />
        </span>
        <div className="cc-neural-net h-10 flex-1 max-w-[120px] rounded-lg opacity-80" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-cc-accent">AI Core Online</span>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-1">
        <InsightCard
          title="Prediksi Panen"
          titleEn="Harvest Forecast"
          Icon={TrendingUp}
          metric="Prediksi Gagal Panen 3%"
          metricNote="(Sangat Rendah)"
          chart="line"
          value={3}
        />
        <InsightCard
          title="Optimalisasi Rute"
          titleEn="Route Optimization"
          Icon={Route}
          metric="Rute A: 4.2 hari · $12.4k"
          metricNote="vs Rute B: 5.1 hari · $14.1k"
          chart="routes"
        />
        <InsightCard
          title="Analisis Permintaan"
          titleEn="Demand Analysis · Analisis Toko"
          Icon={BarChart3}
          metric="Kenaikan Permintaan Beras 15%"
          metricNote="dari Toko · Store signal"
          chart="bars"
          bars={[40, 52, 48, 65, 72, 88]}
        />
      </div>
    </GlassPanel>
  );
}

function InsightCard({
  title,
  titleEn,
  Icon,
  metric,
  metricNote,
  chart,
  value = 3,
  bars = [],
}: {
  title: string;
  titleEn: string;
  Icon: typeof TrendingUp;
  metric: string;
  metricNote: string;
  chart: "line" | "routes" | "bars";
  value?: number;
  bars?: number[];
}) {
  return (
    <article className="cc-insight-card rounded-xl p-3">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cc-accent" />
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{titleEn}</p>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-cc-accent">{metric}</p>
      <p className="text-[10px] text-muted-foreground">{metricNote}</p>
      <div className="mt-3 h-14">
        {chart === "line" && (
          <svg viewBox="0 0 120 40" className="h-full w-full">
            <polyline
              points="0,32 20,28 40,26 60,22 80,18 100,14 120,12"
              fill="none"
              stroke="oklch(0.78 0.16 175)"
              strokeWidth="2"
              className="cc-chart-glow"
            />
            <text x="100" y="10" fontSize="8" fill="oklch(0.78 0.16 175)">
              {value}%
            </text>
          </svg>
        )}
        {chart === "routes" && (
          <svg viewBox="0 0 120 40" className="h-full w-full">
            <path d="M 8 30 Q 40 8 112 12" fill="none" stroke="oklch(0.78 0.16 175)" strokeWidth="1.5" className="cc-route-pulse" />
            <path d="M 8 28 Q 50 32 112 8" fill="none" stroke="oklch(0.65 0.12 195)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
            <circle cx="8" cy="30" r="2" fill="oklch(0.78 0.16 175)" />
            <circle cx="112" cy="12" r="2" fill="oklch(0.78 0.16 175)" />
          </svg>
        )}
        {chart === "bars" && (
          <div className="flex h-full items-end gap-1">
            {bars.map((h, i) => (
              <div
                key={i}
                className="cc-bar flex-1 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
