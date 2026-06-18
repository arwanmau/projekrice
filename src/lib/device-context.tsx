import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type DeviceMode = "desktop" | "tablet" | "mobile";

type Ctx = {
  device: DeviceMode;
  setDevice: (d: DeviceMode) => void;
};

const DeviceContext = createContext<Ctx | null>(null);
const KEY = "gfl.device.mode";

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDeviceState] = useState<DeviceMode>("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(KEY) as DeviceMode | null;
    if (saved === "desktop" || saved === "tablet" || saved === "mobile") {
      setDeviceState(saved);
    }
  }, []);

  const setDevice = (d: DeviceMode) => {
    setDeviceState(d);
    try { localStorage.setItem(KEY, d); } catch {}
  };

  return (
    <DeviceContext.Provider value={{ device, setDevice }}>{children}</DeviceContext.Provider>
  );
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be used within DeviceProvider");
  return ctx;
}

export const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "820px",
  mobile: "100%",
};
