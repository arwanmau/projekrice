import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBatches } from "@/lib/batches-context";
import { AppHeader } from "@/components/AppHeader";
import { CommandCenterShell } from "@/components/command-center/CommandCenterShell";
import { LiveMap } from "@/components/LiveMap";
import { useUserLocation } from "@/hooks/use-user-location";
import { distanceKm, formatCoords, resolveLocation, resolveRoute } from "@/lib/geo";
import type { Batch } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Crosshair,
  MapPin,
  Navigation,
  Radio,
  RefreshCw,
  Thermometer,
  Truck,
  Wind,
} from "lucide-react";
import { MobileSwipeCarousel } from "@/components/MobileSwipeCarousel";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Tracking — Global Food Ledger" },
      {
        name: "description",
        content: "Real-time map of food batches with your GPS location and IoT telemetry.",
      },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const { user } = useAuth();
  const { batches } = useBatches();
  const navigate = useNavigate();
  const { location, status, error, refresh } = useUserLocation(true);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [recenterToken, setRecenterToken] = useState(0);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  if (!user) return null;

  const inTransit = batches.filter((b) => b.status === "In Transit" || b.status === "Warehoused");

  return (
    <CommandCenterShell>
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Live Logistics Map</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Peta interaktif dengan posisi Anda dan batch aktif di rantai pasok.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                refresh();
                setRecenterToken((n) => n + 1);
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Perbarui lokasi
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-primary text-primary-foreground"
              onClick={() => setRecenterToken((n) => n + 1)}
              disabled={!location}
            >
              <Crosshair className="h-4 w-4" />
              Fokus ke saya
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100 animate-fade-up">
            {error}
            <span className="mt-1 block text-xs opacity-80">
              Di Chrome/Edge: klik ikon gembok di address bar → Izinkan Lokasi → refresh halaman.
            </span>
          </div>
        )}

        {mounted ? (
          <div className="animate-fade-up">
            <LiveMap
              batches={batches}
              userLocation={location}
              locationStatus={status}
              recenterToken={recenterToken}
            />
          </div>
        ) : (
          <div className="flex h-[min(70vh,520px)] items-center justify-center rounded-2xl border bg-card text-sm text-muted-foreground">
            Memuat peta…
          </div>
        )}

        {location && (
          <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-3 animate-fade-up">
            <Stat label="Latitude" value={location.lat.toFixed(5)} />
            <Stat label="Longitude" value={location.lng.toFixed(5)} />
            <Stat label="Koordinat" value={formatCoords(location.lat, location.lng)} mono />
          </div>
        )}

        {inTransit.length === 0 ? (
          <p className="rounded-xl border border-dashed bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
            Tidak ada batch dalam perjalanan saat ini.
          </p>
        ) : (
          <>
            <div className="lg:hidden">
              <MobileSwipeCarousel
                showHint={inTransit.length > 1}
                slideBasis="88%"
                slides={inTransit.map((b, i) => ({
                  id: b.id,
                  label: b.id,
                  children: (
                    <BatchTransitCard
                      b={b}
                      i={i}
                      tick={tick}
                      location={location}
                    />
                  ),
                }))}
              />
            </div>
            <div className="hidden gap-4 lg:grid lg:grid-cols-2">
              {inTransit.map((b, i) => (
                <BatchTransitCard
                  key={b.id}
                  b={b}
                  i={i}
                  tick={tick}
                  location={location}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </CommandCenterShell>
  );
}

function BatchTransitCard({
  b,
  i,
  tick,
  location,
}: {
  b: Batch;
  i: number;
  tick: number;
  location: { lat: number; lng: number } | null;
}) {
  const temp = (4 + Math.sin((tick + i) / 2) * 1.2).toFixed(1);
  const speed = (18 + Math.cos((tick + i) / 1.5) * 4).toFixed(0);
  const eta = 100 - ((tick * 3 + i * 17) % 100);
  let distLabel = "—";
  if (location) {
    const route = resolveRoute(b.location);
    const point = route.to ?? route.from ?? resolveLocation(b.location);
    if (point) {
      const km = distanceKm(location.lat, location.lng, point.lat, point.lng);
      distLabel = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(0)} km`;
    }
  }

  return (
    <div
      className="group rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-elegant animate-fade-up"
      style={{ animationDelay: `${i * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary animate-pulse-ring">
            <Truck className="h-5 w-5" />
          </span>
          <div>
            <div className="font-bold tracking-tight">{b.id}</div>
            <div className="text-xs text-muted-foreground">
              {b.product} · {b.weightKg.toLocaleString()} kg
            </div>
          </div>
        </div>
        <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
          Live
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {b.location}
        </span>
        {location && (
          <span className="flex items-center gap-1 font-medium text-primary">
            <Crosshair className="h-3 w-3" /> ±{distLabel} dari Anda
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Telemetry Icon={Thermometer} label="Temp" value={`${temp}°C`} />
        <Telemetry Icon={Wind} label="Speed" value={`${speed} kn`} />
        <Telemetry Icon={Navigation} label="Heading" value={`${(280 + i * 11) % 360}°`} />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" /> ETA progress
          </span>
          <span className="font-mono">{eta}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-700"
            style={{ width: `${eta}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
    </div>
  );
}

function Telemetry({ Icon, label, value }: { Icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/60 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="font-mono text-sm font-bold">{value}</div>
    </div>
  );
}
