import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
  title,
  subtitle,
  icon,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  glow?: boolean;
}) {
  return (
    <section
      className={cn(
        "cc-glass relative overflow-hidden rounded-2xl",
        glow && "cc-glass-glow",
        className
      )}
    >
      <div className="cc-glass-shine pointer-events-none absolute inset-0" />
      {(title || subtitle) && (
        <header className="relative z-10 flex items-start justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="cc-icon-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg">{icon}</span>
            )}
            <div>
              {title && <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">{title}</h2>}
              {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </header>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
