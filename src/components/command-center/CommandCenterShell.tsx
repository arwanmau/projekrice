import { useEffect, type ReactNode } from "react";
import { useTheme } from "@/lib/theme-context";

const FILE_TREE = `projekrice/
├── src/routes/index.tsx
├── src/components/command-center/
│   ├── HolographicCommandDesk.tsx
│   ├── SupplyChainSphere.tsx
│   └── AICommandCore.tsx
└── package.json`;

export function CommandCenterShell({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
    document.documentElement.classList.add("cc-active");
    return () => document.documentElement.classList.remove("cc-active");
  }, [setTheme]);

  return (
    <div className="cc-shell relative min-h-dvh min-h-screen overflow-x-clip max-md:overflow-x-visible">
      <div className="cc-bg-port pointer-events-none absolute inset-0" aria-hidden />
      <div className="cc-bg-streams pointer-events-none absolute inset-0" aria-hidden />
      <div className="cc-bg-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="cc-particles pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="cc-particle" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <pre className="cc-file-overlay pointer-events-none absolute bottom-4 right-4 z-0 hidden font-mono text-[9px] leading-relaxed opacity-[0.12] lg:block">
        {FILE_TREE}
      </pre>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
