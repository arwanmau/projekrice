export type GeoPoint = {
  lat: number;
  lng: number;
  label: string;
  keywords: string[];
};

/** Koordinat kota/rute yang dipakai di data batch. */
export const GEO_LOCATIONS: GeoPoint[] = [
  { lat: -6.3229, lng: 107.3376, label: "Karawang", keywords: ["karawang"] },
  { lat: -7.2575, lng: 112.7521, label: "Surabaya", keywords: ["surabaya"] },
  { lat: -6.2088, lng: 106.8456, label: "Jakarta", keywords: ["jakarta"] },
  { lat: -5.4294, lng: 105.2621, label: "Lampung", keywords: ["lampung"] },
  { lat: 39.0997, lng: -94.5786, label: "Kansas City", keywords: ["kansas", "wichita"] },
  { lat: 51.9244, lng: 4.4777, label: "Rotterdam", keywords: ["rotterdam"] },
  { lat: -12.6819, lng: -56.9211, label: "Mato Grosso", keywords: ["mato grosso"] },
  { lat: -23.9608, lng: -46.3336, label: "Santos", keywords: ["santos"] },
  { lat: 1.3521, lng: 103.8198, label: "Singapore", keywords: ["singapore"] },
  { lat: 45.4642, lng: 9.19, label: "Milano", keywords: ["milano", "milan"] },
  { lat: 41.1171, lng: 16.8719, label: "Bari", keywords: ["bari", "puglia"] },
  { lat: 31.634, lng: 74.8723, label: "Amritsar", keywords: ["amritsar", "punjab", "mumbai"] },
  { lat: -2.5489, lng: 118.0149, label: "Indonesia", keywords: ["indonesia", "id"] },
];

export function resolveLocation(location: string): GeoPoint | null {
  const lower = location.toLowerCase();
  for (const g of GEO_LOCATIONS) {
    if (g.keywords.some((k) => lower.includes(k))) return g;
  }
  return null;
}

/** Ambil titik tujuan dari string rute "A → B". */
export function resolveRoute(location: string): { from: GeoPoint | null; to: GeoPoint | null } {
  const parts = location.split(/→|->| to /i).map((s) => s.trim());
  if (parts.length >= 2) {
    return { from: resolveLocation(parts[0]), to: resolveLocation(parts[1]) };
  }
  const single = resolveLocation(location);
  return { from: single, to: single };
}

/** Jarak antara dua titik (km). */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatCoords(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}
