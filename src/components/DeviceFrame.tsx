import { useEffect, type ReactNode } from "react";
import { Smartphone, Tablet } from "lucide-react";
import { useDevice, DEVICE_WIDTHS, type DeviceMode } from "@/lib/device-context";
import { BackToDesktopButton } from "@/components/BackToDesktopButton";

const PREVIEW_LABELS = {
  mobile: { label: "Mobile", Icon: Smartphone },
  tablet: { label: "Tablet", Icon: Tablet },
} as const;

function DevicePreviewBar({ device }: { device: DeviceMode }) {
  const meta = device === "mobile" || device === "tablet" ? PREVIEW_LABELS[device] : null;
  const PreviewIcon = meta?.Icon;
  const width = DEVICE_WIDTHS[device];

  return (
    <div className="cc-device-preview-bar flex shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 px-3 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex min-w-0 items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {PreviewIcon && <PreviewIcon className="h-3.5 w-3.5 shrink-0" />}
        <span className="truncate">
          {meta?.label ?? device} · {width === "100%" ? "layar penuh" : width}
        </span>
      </div>
      <BackToDesktopButton compact />
    </div>
  );
}

/**
 * Wraps app content in a device-sized frame so users can preview the UI
 * in desktop / tablet / mobile widths from anywhere in the app.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { device } = useDevice();
  const isFramed = device !== "desktop";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (device === "mobile") {
      root.classList.add("gfl-mobile-fullframe");
      return () => root.classList.remove("gfl-mobile-fullframe");
    }
    root.classList.remove("gfl-mobile-fullframe");
  }, [device]);

  if (!isFramed) return <>{children}</>;

  /* Mobile: edge-to-edge full viewport, natural page scroll */
  if (device === "mobile") {
    return (
      <div className="cc-device-fullscreen flex min-h-dvh w-full flex-col bg-background">
        <DevicePreviewBar device="mobile" />
        <div className="cc-device-fullscreen-content w-full flex-1">{children}</div>
      </div>
    );
  }

  /* Tablet: centered column, full height — no inner scroll cage */
  return (
    <div className="cc-device-tablet-preview flex min-h-dvh w-full flex-col bg-gradient-to-br from-muted/40 via-background to-muted/30">
      <div className="sticky top-0 z-[60] mx-auto w-full max-w-[52rem] px-3 pt-3">
        <DevicePreviewBar device="tablet" />
      </div>
      <div className="cc-device-tablet-content mx-auto w-full max-w-[52rem] flex-1 px-3 pb-6">
        {children}
      </div>
    </div>
  );
}
