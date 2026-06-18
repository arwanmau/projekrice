import { createFileRoute } from "@tanstack/react-router";
import { getSystemHealth } from "@/server/admin/store";
import { buildAdminAnalytics } from "@/server/admin/analytics-service";
import { assertAdminRequest, jsonResponse } from "@/server/admin/auth";

export const Route = createFileRoute("/api/admin/health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        const analytics = buildAdminAnalytics();
        return jsonResponse({
          ok: true,
          checkedAt: new Date().toISOString(),
          services: getSystemHealth(),
          solana: analytics.solana,
          kpis: {
            apiRequests24h: analytics.kpis.apiRequests24h,
            successRatePct: analytics.kpis.successRatePct,
            avgConfirmMs: analytics.kpis.avgConfirmMs,
          },
        });
      },
    },
  },
});
