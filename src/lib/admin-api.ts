import type { Batch } from "@/lib/mock-data";
import type { AdminAnalyticsPayload } from "@/server/admin/types";

const ADMIN_HEADER = "x-gfl-admin-email";

function adminHeaders(adminEmail: string): HeadersInit {
  return {
    "content-type": "application/json",
    "x-gfl-admin-email": adminEmail,
  };
}

export async function fetchAdminAnalytics(
  adminEmail: string,
  batches?: Batch[],
): Promise<AdminAnalyticsPayload> {
  const res = await fetch("/api/admin/analytics", {
    method: batches?.length ? "POST" : "GET",
    headers: adminHeaders(adminEmail),
    body: batches?.length ? JSON.stringify({ batches }) : undefined,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Analytics API error (${res.status})`);
  }

  return res.json() as Promise<AdminAnalyticsPayload>;
}

export async function fetchAdminHealth(adminEmail: string) {
  const res = await fetch("/api/admin/health", {
    headers: { [ADMIN_HEADER]: adminEmail },
  });
  if (!res.ok) throw new Error(`Health API error (${res.status})`);
  return res.json();
}
