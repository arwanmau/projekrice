import { useQuery } from "@tanstack/react-query";
import { fetchAdminAnalytics } from "@/lib/admin-api";
import type { Batch } from "@/lib/mock-data";

export function useAdminAnalytics(adminEmail: string | undefined, batches: Batch[]) {
  return useQuery({
    queryKey: ["admin-analytics", adminEmail, batches.length, batches.map((b) => b.id).join(",")],
    queryFn: () => fetchAdminAnalytics(adminEmail!, batches),
    enabled: !!adminEmail && /admin/i.test(adminEmail),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
