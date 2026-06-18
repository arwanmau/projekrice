import { useCallback, useEffect, useState } from "react";

export type UserLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  updatedAt: number;
};

export type LocationStatus = "idle" | "loading" | "ready" | "denied" | "unavailable";

export function useUserLocation(watch = true) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const applyPosition = useCallback((pos: GeolocationPosition) => {
    setLocation({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      updatedAt: pos.timestamp,
    });
    setStatus("ready");
    setError(null);
  }, []);

  const onError = useCallback((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      setStatus("denied");
      setError("Izin lokasi ditolak. Aktifkan di pengaturan browser.");
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      setStatus("unavailable");
      setError("Lokasi tidak tersedia. Periksa GPS atau koneksi.");
    } else {
      setStatus("unavailable");
      setError("Gagal mengambil lokasi. Coba lagi.");
    }
  }, []);

  const refresh = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      setError("Browser tidak mendukung geolokasi.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(applyPosition, onError, {
      enableHighAccuracy: true,
      timeout: 12_000,
      maximumAge: 30_000,
    });
  }, [applyPosition, onError]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      setError("Browser tidak mendukung geolokasi.");
      return;
    }

    setStatus("loading");
    const opts: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 12_000,
      maximumAge: 30_000,
    };

    navigator.geolocation.getCurrentPosition(applyPosition, onError, opts);

    if (!watch) return;

    const id = navigator.geolocation.watchPosition(applyPosition, onError, {
      enableHighAccuracy: true,
      timeout: 15_000,
      maximumAge: 10_000,
    });

    return () => navigator.geolocation.clearWatch(id);
  }, [watch, applyPosition, onError]);

  return { location, status, error, refresh };
}
