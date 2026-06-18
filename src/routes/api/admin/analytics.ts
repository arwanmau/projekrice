import { createFileRoute } from "@tanstack/react-router";
import { buildAdminAnalytics } from "@/server/admin/analytics-service";
import { assertAdminRequest, jsonResponse } from "@/server/admin/auth";
import type { AnalyticsRequestBody } from "@/server/admin/types";
import type { Batch } from "@/lib/mock-data";

export const Route = createFileRoute("/api/admin/analytics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        return jsonResponse(buildAdminAnalytics());
      },
      POST: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        let body: AnalyticsRequestBody = {};
        try {
          const text = await request.text();
          if (text) body = JSON.parse(text) as AnalyticsRequestBody;
        } catch {
          return jsonResponse({ error: "Invalid JSON body" }, { status: 400 });
        }
        const batches = Array.isArray(body.batches) ? (body.batches as Batch[]) : undefined;
        return jsonResponse(buildAdminAnalytics(batches));
      },
    },
  },
});
