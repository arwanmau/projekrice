import { Monitor } from "lucide-react";
import { useDevice } from "@/lib/device-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BackToDesktopButtonProps = {
  className?: string;
  /** Icon only — for cramped headers */
  compact?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
};

export function BackToDesktopButton({
  className,
  compact = false,
  variant = "outline",
}: BackToDesktopButtonProps) {
  const { device, setDevice } = useDevice();

  if (device === "desktop") return null;

  const handleClick = () => {
    setDevice("desktop");
    toast.success("Tampilan desktop dipulihkan");
  };

  return (
    <Button
      type="button"
      size={compact ? "icon" : "sm"}
      variant={variant}
      onClick={handleClick}
      aria-label="Kembali ke tampilan desktop"
      title="Kembali ke Desktop"
      className={cn(
        compact ? "h-9 w-9 shrink-0" : "h-9 gap-1.5 shrink-0",
        variant === "outline" && "cc-back-desktop-btn",
        className,
      )}
    >
      <Monitor className="h-4 w-4 shrink-0" />
      {!compact && <span className="max-[380px]:hidden">Kembali ke Desktop</span>}
      {!compact && <span className="hidden max-[380px]:inline">Desktop</span>}
    </Button>
  );
}
