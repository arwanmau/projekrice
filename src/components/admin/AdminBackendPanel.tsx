import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminAnalyticsCharts } from "./AdminAnalyticsCharts";
import type { AdminAnalyticsPayload } from "@/server/admin/types";
import { cn } from "@/lib/utils";

type Props = {
  data: AdminAnalyticsPayload;
  loading?: boolean;
  onRefresh: () => void;
};

export function AdminBackendPanel({ data, loading, onRefresh }: Props) {
  const { kpis, systemHealth, solana, countries, auditLog } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            Data back-end · diperbarui{" "}
            <time dateTime={data.generatedAt}>{new Date(data.generatedAt).toLocaleString("id-ID")}</time>
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Sync API
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Database} label="Batch Aktif" value={String(kpis.activeBatches)} sub={`${kpis.totalTonnage} t`} />
        <KpiCard icon={Activity} label="Event On-Chain" value={String(kpis.onChainEvents)} sub={`${kpis.successRatePct}% sukses`} />
        <KpiCard icon={Zap} label="API 24j" value={kpis.apiRequests24h.toLocaleString()} sub={`${kpis.avgConfirmMs} ms avg`} />
        <KpiCard icon={Globe} label="Escrow Terkunci" value={`$${kpis.escrowLockedUsd.toLocaleString()}`} sub={`${kpis.inTransit} in transit`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-4 w-4 text-primary" />
              Kesehatan Layanan Back-End
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 sm:p-6 sm:pt-0">
            {systemHealth.map((svc) => (
              <div
                key={svc.service}
                className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 last:border-0 sm:px-0"
              >
                <div className="flex items-center gap-2">
                  <HealthDot status={svc.status} />
                  <span className="text-sm font-medium">{svc.service}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{svc.latencyMs} ms</span>
                  <span>·</span>
                  <span>{svc.uptimePct}% uptime</span>
                  <Badge variant={svc.status === "healthy" ? "secondary" : "outline"} className="capitalize">
                    {svc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-chain" />
              Solana Devnet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Slot" value={solana.slot.toLocaleString()} mono />
            <Row label="TPS" value={String(solana.tps)} mono />
            <Row label="Validator" value={`${solana.validatorsOnline} online`} />
            <Row label="Network" value={solana.network} />
          </CardContent>
        </Card>
      </div>

      <AdminAnalyticsCharts data={data} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volume per Negara</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Negara</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="text-right">Tonase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((c) => (
                  <TableRow key={c.country}>
                    <TableCell className="font-medium">{c.country}</TableCell>
                    <TableCell>{c.batches}</TableCell>
                    <TableCell className="text-right font-mono">{c.tonnage} t</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Audit Log (Back-End)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[320px] overflow-y-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(e.timestamp).toLocaleString("id-ID", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{e.action}</div>
                      <div className="text-[10px] text-muted-foreground">{e.resource}</div>
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={e.severity} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

function HealthDot({ status }: { status: "healthy" | "degraded" | "down" }) {
  const color =
    status === "healthy" ? "bg-emerald-500" : status === "degraded" ? "bg-amber-500" : "bg-destructive";
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} />;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold", mono && "font-mono text-xs")}>{value}</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "info" | "warn" | "critical" }) {
  if (severity === "critical")
    return (
      <Badge variant="destructive" className="gap-1 text-[10px]">
        <AlertTriangle className="h-3 w-3" /> critical
      </Badge>
    );
  if (severity === "warn")
    return (
      <Badge variant="outline" className="gap-1 border-amber-500/40 text-[10px] text-amber-600">
        <AlertTriangle className="h-3 w-3" /> warn
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1 text-[10px]">
      <CheckCircle2 className="h-3 w-3" /> info
    </Badge>
  );
}
