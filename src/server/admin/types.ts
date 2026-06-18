import type { Batch, BatchStatus } from "@/lib/mock-data";

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
  lastActive: string;
  batchesLinked: number;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  severity: "info" | "warn" | "critical";
  ip: string;
  txHash?: string;
};

export type SystemHealthMetric = {
  service: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  uptimePct: number;
  lastCheck: string;
};

export type AdminKpis = {
  totalUsers: number;
  activeBatches: number;
  totalTonnage: number;
  inTransit: number;
  escrowLockedUsd: number;
  onChainEvents: number;
  avgConfirmMs: number;
  successRatePct: number;
  apiRequests24h: number;
};

export type ThroughputPoint = { month: string; rice: number; wheat: number; other: number };
export type StatusSlice = { status: BatchStatus; count: number; pct: number };
export type RevenuePoint = { week: string; usdc: number };
export type CountryVolume = { country: string; batches: number; tonnage: number };

export type AdminAnalyticsPayload = {
  generatedAt: string;
  kpis: AdminKpis;
  throughput: ThroughputPoint[];
  statusDistribution: StatusSlice[];
  revenueWeekly: RevenuePoint[];
  countries: CountryVolume[];
  users: AdminUserRecord[];
  auditLog: AuditLogEntry[];
  systemHealth: SystemHealthMetric[];
  solana: {
    network: string;
    slot: number;
    tps: number;
    validatorsOnline: number;
  };
};

export type AnalyticsRequestBody = {
  batches?: Batch[];
};
