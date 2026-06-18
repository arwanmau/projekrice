import { BATCHES, type Batch, type BatchStatus } from "@/lib/mock-data";
import { ADMIN_USERS, AUDIT_LOG, getSystemHealth } from "./store";
import type {
  AdminAnalyticsPayload,
  AdminKpis,
  CountryVolume,
  RevenuePoint,
  StatusSlice,
  ThroughputPoint,
} from "./types";

const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"] as const;

function resolveBatches(override?: Batch[]): Batch[] {
  if (override?.length) return override;
  return BATCHES;
}

function countByStatus(batches: Batch[]): StatusSlice[] {
  const counts = new Map<BatchStatus, number>();
  for (const b of batches) {
    counts.set(b.status, (counts.get(b.status) ?? 0) + 1);
  }
  const total = batches.length || 1;
  return Array.from(counts.entries()).map(([status, count]) => ({
    status,
    count,
    pct: Math.round((count / total) * 100),
  }));
}

function buildThroughput(batches: Batch[]): ThroughputPoint[] {
  const base = batches.reduce(
    (acc, b) => {
      const key = b.product.toLowerCase().includes("rice")
        ? "rice"
        : b.product.toLowerCase().includes("wheat")
          ? "wheat"
          : "other";
      acc[key] += b.weightKg / 1000;
      return acc;
    },
    { rice: 0, wheat: 0, other: 0 },
  );

  return MONTHS.map((month, i) => {
    const factor = 0.55 + i * 0.09;
    return {
      month,
      rice: Math.round(base.rice * factor * (0.85 + i * 0.04)),
      wheat: Math.round(base.wheat * factor * (0.8 + i * 0.05)),
      other: Math.round(base.other * factor * 0.7),
    };
  });
}

function buildRevenue(batches: Batch[]): RevenuePoint[] {
  const escrowTotal = batches.reduce((s, b) => s + (b.escrow?.amountUSD ?? 0), 0);
  const base = escrowTotal > 0 ? escrowTotal / 6000 : 28;
  return ["W1", "W2", "W3", "W4", "W5", "W6"].map((week, i) => ({
    week,
    usdc: Math.round(base * (0.7 + i * 0.12 + Math.sin(i) * 0.08)),
  }));
}

function buildCountries(batches: Batch[]): CountryVolume[] {
  const map = new Map<string, { batches: number; tonnage: number }>();
  for (const b of batches) {
    const c = b.origin.country;
    const cur = map.get(c) ?? { batches: 0, tonnage: 0 };
    cur.batches += 1;
    cur.tonnage += b.weightKg / 1000;
    map.set(c, cur);
  }
  return Array.from(map.entries())
    .map(([country, v]) => ({ country, ...v, tonnage: Math.round(v.tonnage * 10) / 10 }))
    .sort((a, b) => b.tonnage - a.tonnage);
}

function buildKpis(batches: Batch[]): AdminKpis {
  const onChainEvents = batches.reduce((s, b) => s + b.timeline.length, 0);
  const totalKg = batches.reduce((s, b) => s + b.weightKg, 0);
  const inTransit = batches.filter((b) => b.status === "In Transit" || b.status === "Warehoused").length;
  const escrowLockedUsd = batches.reduce((s, b) => s + (b.escrow?.amountUSD ?? 0), 0);

  return {
    totalUsers: ADMIN_USERS.length,
    activeBatches: batches.length,
    totalTonnage: Math.round((totalKg / 1000) * 10) / 10,
    inTransit,
    escrowLockedUsd,
    onChainEvents,
    avgConfirmMs: 412 + (batches.length % 5) * 18,
    successRatePct: 99.2 - (inTransit > 2 ? 0.3 : 0),
    apiRequests24h: 18420 + batches.length * 240,
  };
}

/** Back-end analytics aggregator — single source for admin dashboard. */
export function buildAdminAnalytics(batchesOverride?: Batch[]): AdminAnalyticsPayload {
  const batches = resolveBatches(batchesOverride);

  return {
    generatedAt: new Date().toISOString(),
    kpis: buildKpis(batches),
    throughput: buildThroughput(batches),
    statusDistribution: countByStatus(batches),
    revenueWeekly: buildRevenue(batches),
    countries: buildCountries(batches),
    users: ADMIN_USERS,
    auditLog: AUDIT_LOG,
    systemHealth: getSystemHealth(),
    solana: {
      network: "devnet",
      slot: 284_912_004 + batches.length * 17,
      tps: 2840 + batches.length * 12,
      validatorsOnline: 21,
    },
  };
}
