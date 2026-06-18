import { useDesk } from "./desk-context";

/** Visual data beams connecting desk modules */
export function DataThreads() {
  const { routeOptimized, highlightNode } = useDesk();

  return (
    <svg
      className="cc-threads pointer-events-none absolute inset-0 z-[5] h-full w-full"
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="beamGreen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.78 0.16 175 / 0)" />
          <stop offset="50%" stopColor="oklch(0.78 0.16 175 / 0.9)" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 175 / 0)" />
        </linearGradient>
        <linearGradient id="beamOrange" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.75 0.18 55 / 0)" />
          <stop offset="50%" stopColor="oklch(0.75 0.18 55 / 0.8)" />
          <stop offset="100%" stopColor="oklch(0.75 0.18 55 / 0)" />
        </linearGradient>
      </defs>

      {/* Scan Hub → Sphere (plant/farm) */}
      <path
        d="M 120 620 Q 280 480 380 320"
        fill="none"
        stroke={highlightNode === "plant" ? "url(#beamGreen)" : "url(#beamOrange)"}
        strokeWidth="2"
        className="cc-beam"
        opacity={highlightNode ? 1 : 0.45}
      />

      {/* AI Core → Sphere route optimization */}
      <path
        d="M 880 280 Q 650 300 420 300"
        fill="none"
        stroke={routeOptimized ? "url(#beamGreen)" : "url(#beamOrange)"}
        strokeWidth="2.5"
        className="cc-beam cc-beam--fast"
      />

      {/* AI Demand → Metrics center */}
      <path
        d="M 820 420 Q 600 380 220 360"
        fill="none"
        stroke="url(#beamGreen)"
        strokeWidth="1.5"
        className="cc-beam"
        opacity="0.5"
      />

      {/* Sphere → Ledger */}
      <path
        d="M 400 420 Q 550 520 780 620"
        fill="none"
        stroke="url(#beamGreen)"
        strokeWidth="1.5"
        className="cc-beam"
        opacity="0.4"
      />
    </svg>
  );
}
