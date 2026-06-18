import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminAnalyticsPayload } from "@/server/admin/types";

const STATUS_COLORS: Record<string, string> = {
  Delivered: "var(--success)",
  "In Transit": "var(--chain)",
  Warehoused: "oklch(0.65 0.12 250)",
  Inspected: "var(--secondary)",
  Harvested: "var(--primary)",
  "Pending Escrow": "var(--warning)",
};

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

type Props = {
  data: AdminAnalyticsPayload;
};

export function AdminAnalyticsCharts({ data }: Props) {
  const pieData = data.statusDistribution.map((s) => ({
    name: s.status,
    value: s.count,
    pct: s.pct,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2">
        <div className="mb-3">
          <div className="text-sm font-semibold">Throughput Bulanan (ton)</div>
          <div className="text-[11px] text-muted-foreground">Agregasi back-end dari batch aktif</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data.throughput} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="admin-g-rice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="admin-g-wheat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chain)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--chain)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="rice" stroke="var(--primary)" strokeWidth={2} fill="url(#admin-g-rice)" />
            <Area type="monotone" dataKey="wheat" stroke="var(--chain)" strokeWidth={2} fill="url(#admin-g-wheat)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3">
          <div className="text-sm font-semibold">Distribusi Status</div>
          <div className="text-[11px] text-muted-foreground">Live dari ledger</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={2}>
              {pieData.map((s) => (
                <Cell key={s.name} fill={STATUS_COLORS[s.name] ?? "var(--muted)"} stroke="var(--card)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {pieData.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[s.name] }} />
                {s.name}
              </span>
              <span className="font-semibold">{s.value} · {s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-3">
        <div className="mb-3">
          <div className="text-sm font-semibold">Settlement USDC Mingguan (ribu)</div>
          <div className="text-[11px] text-muted-foreground">Escrow & on-chain settlement</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.revenueWeekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)", opacity: 0.4 }} />
            <Bar dataKey="usdc" radius={[6, 6, 0, 0]} fill="var(--primary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
