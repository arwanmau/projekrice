import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { CommandCenterShell } from "@/components/command-center/CommandCenterShell";
import { BATCHES } from "@/lib/mock-data";
import { Sparkles, AlertTriangle, TrendingUp, Leaf, Zap, Bot, ShieldAlert, Gauge } from "lucide-react";
import { MobileSwipeCarousel } from "@/components/MobileSwipeCarousel";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — Global Food Ledger" },
      { name: "description", content: "AI-powered anomaly detection, risk scoring, and recommendations for your supply chain." },
    ],
  }),
  component: InsightsPage,
});

const INSIGHTS = [
  {
    Icon: AlertTriangle,
    tone: "warn",
    title: "Cuaca buruk di Selat Malaka",
    body: "Batch RICE-8842 berisiko delay 36 jam. Rekomendasi: re-route via Selat Sunda, hemat ~$1,240 demurrage.",
  },
  {
    Icon: TrendingUp,
    tone: "good",
    title: "Permintaan beras IR64 naik 18%",
    body: "Sinyal pasar EU menunjukkan lonjakan demand. Pertimbangkan menaikkan locked-in price 4–6% pada kontrak baru.",
  },
  {
    Icon: ShieldAlert,
    tone: "danger",
    title: "Anomali timbangan WHEAT-2207",
    body: "Selisih 0.42% dari manifest. Sudah ditandai untuk re-inspect oleh AgriCert sebelum bongkar muat.",
  },
  {
    Icon: Leaf,
    tone: "info",
    title: "Carbon footprint turun 9%",
    body: "Optimasi rute kuartal ini berhasil. Anda layak klaim sertifikat ESG untuk laporan investor.",
  },
];

const TONES: Record<string, string> = {
  warn: "border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400",
  good: "border-success/30 bg-success/5 text-success",
  danger: "border-destructive/30 bg-destructive/5 text-destructive",
  info: "border-chain/30 bg-chain/5 text-chain",
};

function useTypewriter(text: string, speed = 18) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

function InsightsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const summary = useMemo(
    () =>
      `Saya menganalisa ${BATCHES.length} batch aktif dengan total ${BATCHES.reduce(
        (a, b) => a + b.weightKg,
        0
      ).toLocaleString()} kg. Tiga sinyal penting terdeteksi minggu ini — geser ke bawah untuk detail.`,
    []
  );
  const typed = useTypewriter(summary, 14);

  if (!user) return null;

  const riskScore = 27; // 0..100, lower is better
  const efficiency = 91;
  const onChainCoverage = 100;

  return (
    <CommandCenterShell>
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
        <div className="flex items-center gap-4 animate-fade-up">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow animate-pulse-ring">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Insights</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Analisa otomatis dari telemetri, on-chain events & sinyal pasar.
            </p>
          </div>
        </div>

        {/* Assistant summary */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-elegant animate-fade-up">
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <div className="relative flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ledger Copilot
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground animate-typewriter">
                {typed}
              </p>
            </div>
          </div>
        </div>

        {/* Score gauges */}
        <div className="sm:hidden">
          <MobileSwipeCarousel
            slideBasis="88%"
            slides={[
              {
                id: "risk",
                label: "Risk Score",
                children: (
                  <Gauge3 label="Risk Score" value={riskScore} hint="lower = safer" Icon={Gauge} invert />
                ),
              },
              {
                id: "efficiency",
                label: "Efficiency",
                children: (
                  <Gauge3 label="Efficiency" value={efficiency} hint="route + cost" Icon={Zap} />
                ),
              },
              {
                id: "coverage",
                label: "On-chain Coverage",
                children: (
                  <Gauge3
                    label="On-chain Coverage"
                    value={onChainCoverage}
                    hint="ledger sync"
                    Icon={ShieldAlert}
                  />
                ),
              },
            ]}
          />
        </div>
        <div className="hidden gap-4 sm:grid sm:grid-cols-3">
          <Gauge3 label="Risk Score" value={riskScore} hint="lower = safer" Icon={Gauge} invert />
          <Gauge3 label="Efficiency" value={efficiency} hint="route + cost" Icon={Zap} />
          <Gauge3 label="On-chain Coverage" value={onChainCoverage} hint="ledger sync" Icon={ShieldAlert} />
        </div>

        {/* Insight cards */}
        <section className="sm:hidden">
          <MobileSwipeCarousel
            slideBasis="90%"
            slides={INSIGHTS.map((it, i) => ({
              id: it.title,
              label: it.title,
              children: (
                <article
                  className={`rounded-xl border p-4 shadow-sm transition hover:shadow-elegant animate-fade-up ${TONES[it.tone]}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background/60">
                      <it.Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-bold tracking-tight text-foreground">{it.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                        AI confidence · {78 + i * 4}%
                      </div>
                    </div>
                  </div>
                </article>
              ),
            }))}
          />
        </section>
        <section className="hidden gap-4 sm:grid lg:grid-cols-2">
          {INSIGHTS.map((it, i) => (
            <article
              key={it.title}
              className={`rounded-xl border p-4 shadow-sm transition hover:shadow-elegant animate-fade-up ${TONES[it.tone]}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background/60">
                  <it.Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold tracking-tight text-foreground">{it.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                    AI confidence · {78 + i * 4}%
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </CommandCenterShell>
  );
}

function Gauge3({
  label,
  value,
  hint,
  Icon,
  invert,
}: {
  label: string;
  value: number;
  hint: string;
  Icon: typeof Gauge;
  invert?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const score = invert ? 100 - pct : pct;
  const color =
    score > 75 ? "var(--success)" : score > 45 ? "oklch(0.78 0.15 80)" : "var(--destructive)";
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
          <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div>
          <div className="font-mono text-3xl font-bold tracking-tight">{pct}</div>
          <div className="text-[11px] text-muted-foreground">{hint}</div>
        </div>
      </div>
    </div>
  );
}
