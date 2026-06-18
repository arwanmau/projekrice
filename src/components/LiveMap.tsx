import { Fragment, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Batch } from "@/lib/mock-data";
import { formatCoords, resolveLocation, resolveRoute } from "@/lib/geo";
import type { UserLocation, LocationStatus } from "@/hooks/use-user-location";
import { useTheme } from "@/lib/theme-context";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Perbaiki ikon default Leaflet di bundler Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = L.divIcon({
  className: "",
  html: `<div class="gfl-user-pin"><span class="gfl-user-pin-core"></span><span class="gfl-user-pin-ring"></span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const batchIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `<div class="gfl-batch-pin ${active ? "gfl-batch-pin--live" : ""}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

type BatchMarker = {
  batch: Batch;
  lat: number;
  lng: number;
  label: string;
  route?: { from: { lat: number; lng: number }; to: { lat: number; lng: number } };
};

function buildBatchMarkers(batches: Batch[]): BatchMarker[] {
  return batches.flatMap((batch) => {
    const route = resolveRoute(batch.location);
    if (
      route.from &&
      route.to &&
      (route.from.lat !== route.to.lat || route.from.lng !== route.to.lng)
    ) {
      const midLat = (route.from.lat + route.to.lat) / 2;
      const midLng = (route.from.lng + route.to.lng) / 2;
      return [
        {
          batch,
          lat: midLat,
          lng: midLng,
          label: route.to.label,
          route: {
            from: { lat: route.from.lat, lng: route.from.lng },
            to: { lat: route.to.lat, lng: route.to.lng },
          },
        },
      ];
    }
    const point = route.to ?? route.from ?? resolveLocation(batch.location);
    if (!point) return [];
    return [{ batch, lat: point.lat, lng: point.lng, label: point.label }];
  });
}

function BatchMapLayer({ marker: m }: { marker: BatchMarker }) {
  return (
    <Fragment>
      {m.route && (
        <Polyline
          positions={[
            [m.route.from.lat, m.route.from.lng],
            [m.route.to.lat, m.route.to.lng],
          ]}
          pathOptions={{ color: "var(--chain)", weight: 3, opacity: 0.65, dashArray: "8 10" }}
        />
      )}
      <Marker position={[m.lat, m.lng]} icon={batchIcon(m.batch.status === "In Transit")}>
        <Popup>
          <div className="text-sm font-bold">{m.batch.id}</div>
          <div className="text-xs text-muted-foreground">
            {m.batch.product} · {m.label}
          </div>
          <div className="mt-1 text-xs">{m.batch.location}</div>
        </Popup>
      </Marker>
    </Fragment>
  );
}

function MapViewController({
  user,
  markers,
}: {
  user: UserLocation | null;
  markers: BatchMarker[];
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [];
    if (user) points.push([user.lat, user.lng]);
    for (const m of markers) points.push([m.lat, m.lng]);

    if (points.length === 0) {
      map.setView([-2.5, 118], 5);
      return;
    }

    if (user && points.length === 1) {
      map.setView([user.lat, user.lng], 13, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds.pad(0.25), { animate: true, maxZoom: user ? 12 : 6 });
  }, [map, user?.lat, user?.lng, markers.length]);

  return null;
}

function RecenterOnUser({ user, trigger }: { user: UserLocation | null; trigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (user) map.flyTo([user.lat, user.lng], Math.max(map.getZoom(), 13), { duration: 1.2 });
  }, [map, user?.lat, user?.lng, trigger]);
  return null;
}

type LiveMapProps = {
  batches: Batch[];
  userLocation: UserLocation | null;
  locationStatus: LocationStatus;
  recenterToken?: number;
};

export function LiveMap({ batches, userLocation, locationStatus, recenterToken = 0 }: LiveMapProps) {
  const { theme } = useTheme();
  const inTransit = batches.filter((b) => b.status === "In Transit" || b.status === "Warehoused");
  const markers = useMemo(() => buildBatchMarkers(inTransit), [inTransit]);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    theme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const defaultCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-2.5, 118];
  const defaultZoom = userLocation ? 13 : 5;

  return (
    <div className="gfl-map-wrap relative overflow-hidden rounded-2xl border bg-card shadow-elegant">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="gfl-map-container z-0"
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <ZoomControl position="topright" />
        <MapViewController user={userLocation} markers={markers} />
        <RecenterOnUser user={userLocation} trigger={recenterToken} />

        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-sm font-semibold">Lokasi Anda</div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  {formatCoords(userLocation.lat, userLocation.lng)}
                </div>
                {userLocation.accuracy > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Akurasi ±{Math.round(userLocation.accuracy)} m
                  </div>
                )}
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={Math.min(userLocation.accuracy, 800)}
              pathOptions={{
                color: "var(--primary)",
                fillColor: "var(--primary)",
                fillOpacity: 0.12,
                weight: 2,
              }}
            />
          </>
        )}

        {markers.map((m) => (
          <BatchMapLayer key={m.batch.id} marker={m} />
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-wrap items-start justify-between gap-2 p-3">
        <div className="pointer-events-auto rounded-lg border bg-background/95 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`h-2 w-2 rounded-full ${
                locationStatus === "ready"
                  ? "bg-success animate-pulse"
                  : locationStatus === "loading"
                    ? "bg-amber-500 animate-pulse"
                    : "bg-muted-foreground"
              }`}
            />
            {locationStatus === "ready"
              ? "Lokasi Anda aktif"
              : locationStatus === "loading"
                ? "Mencari lokasi…"
                : locationStatus === "denied"
                  ? "Izin lokasi ditolak"
                  : "Lokasi tidak tersedia"}
          </div>
          {userLocation && (
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
              {formatCoords(userLocation.lat, userLocation.lng)}
            </p>
          )}
        </div>
        <div className="pointer-events-auto flex gap-2">
          <span className="rounded-lg border bg-background/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-chain shadow-sm">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-chain" />
            Batch aktif ({markers.length})
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border bg-background/95 px-3 py-2 text-[10px] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="gfl-legend-user" /> Anda
          </span>
          <span className="flex items-center gap-1.5">
            <span className="gfl-legend-batch gfl-legend-batch--live" /> Dalam perjalanan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="gfl-legend-batch" /> Gudang / transit
          </span>
        </div>
      </div>
    </div>
  );
}
