import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBatches } from "@/lib/batches-context";
import { useAdminAnalytics } from "@/hooks/use-admin-analytics";
import { AppHeader } from "@/components/AppHeader";
import { AdminBackendPanel } from "@/components/admin/AdminBackendPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  Users,
  Package,
  Trash2,
  Crown,
  BarChart3,
  Settings2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard & Analytics — Global Food Ledger" },
      {
        name: "description",
        content: "Administrative dashboard with back-end analytics, user management, and batch operations.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { batches, removeBatch } = useBatches();
  const analytics = useAdminAnalytics(user?.isAdmin ? user.email : undefined, batches);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10">
            <ShieldCheck className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Akses ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Halaman ini khusus admin. Login dengan email yang mengandung{" "}
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">admin</code>
            (mis. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">admin@gfl.io</code>).
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Kembali ke Dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    removeBatch(id);
    toast.success(`Batch ${id} dihapus`);
    void analytics.refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Crown className="h-3 w-3" /> Admin Console
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard Admin & Analitik</h1>
            <p className="text-sm text-muted-foreground">
              Pantau KPI, kesehatan back-end, audit log, dan operasi platform.
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 border-chain/40 text-chain">
            <ShieldCheck className="h-3 w-3" />
            API · /api/admin/*
          </Badge>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-auto">
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="h-4 w-4" />
              Analitik Back-End
            </TabsTrigger>
            <TabsTrigger value="operations" className="gap-1.5">
              <Settings2 className="h-4 w-4" />
              Operasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-0">
            {analytics.isLoading && !analytics.data ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Memuat analitik dari back-end…</p>
              </div>
            ) : analytics.isError ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm font-medium">Gagal memuat analitik API</p>
                <p className="max-w-md text-xs text-muted-foreground">{analytics.error.message}</p>
                <Button size="sm" onClick={() => analytics.refetch()}>
                  Coba lagi
                </Button>
              </div>
            ) : analytics.data ? (
              <AdminBackendPanel
                data={analytics.data}
                loading={analytics.isFetching}
                onRefresh={() => void analytics.refetch()}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="operations" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(analytics.data?.users ?? []).map((u) => (
                      <TableRow key={u.email}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === "Admin" ? "default" : "secondary"}>{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              u.status === "Active" ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                u.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {u.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.info(`Audit log untuk ${u.name} dibuka`)}
                          >
                            Audit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" /> Batch Override
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                        <TableCell>
                          {b.product} · {b.variety}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{b.status}</Badge>
                        </TableCell>
                        <TableCell>{b.weightKg.toLocaleString()} kg</TableCell>
                        <TableCell className="text-muted-foreground">{b.location}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(b.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
