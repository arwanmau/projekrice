import { useBatches } from "@/lib/batches-context";
import { GlassPanel } from "./GlassPanel";
import { Globe2, Ship, Plane } from "lucide-react";

const NODES = [
  { id: "farm", x: 62, y: 58, label: "Peternakan Jawa", status: "ACTIVE", sub: "Karawang · ID" },
  { id: "plant", x: 58, y: 48, label: "Pabrik Vietnam", status: "ACTIVE", sub: "Ho Chi Minh · VN" },
  { id: "port", x: 66, y: 54, label: "Pelabuhan Surabaya", status: "ACTIVE", sub: "Jawa Timur · ID" },
  { id: "market", x: 60, y: 62, label: "Pasar Jakarta", status: "ACTIVE", sub: "DKI · ID" },
] as const;

const ROUTES: [string, string][] = [
  ["farm", "port"],
  ["plant", "port"],
  ["port", "market"],
  ["port", "plant"],
];

export function HologramMapModule() {
  const { batches } = useBatches();
  const inTransit = batches.filter((b) => b.status === "In Transit").length;
  const onChain = batches.reduce((a, b) => a + b.timeline.length, 0);
  const countries = new Set(batches.map((b) => b.origin.country)).size;

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <GlassPanel
      glow
      title="Peta Rantai Pasok Global (Live)"
      subtitle="Global Supply Chain Map · Asia Tenggara"
      icon={<Globe2 className="h-4 w-4 text-cc-accent" />}
      className="col-span-full lg:col-span-2 lg:row-span-2"
    >
      <div className="relative aspect-[16/10] min-h-[280px] w-full sm:min-h-[340px]">
        <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="ccMapGlow" cx="55%" cy="50%" r="55%">
              <stop offset="0%" stopColor="oklch(0.72 0.14 175 / 0.35)" />
              <stop offset="100%" stopColor="oklch(0.15 0.04 250 / 0)" />
            </radialGradient>
            <linearGradient id="ccRoute" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.78 0.16 175)" />
              <stop offset="100%" stopColor="oklch(0.72 0.14 195)" />
            </linearGradient>
            <filter id="ccGlow">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100" height="70" fill="url(#ccMapGlow)" />
          {/* SE Asia landmass stylized */}
          <g fill="oklch(0.28 0.06 200)" opacity="0.7">
            <path d="M48 18 L72 16 L78 28 L74 42 L68 52 L58 58 L50 56 L44 48 L42 36 Z" />
            <path d="M52 52 L70 50 L76 62 L68 68 L54 66 Z" />
            <path d="M38 44 L48 42 L50 54 L42 58 Z" />
          </g>
          <ellipse cx="58" cy="48" rx="22" ry="16" fill="none" stroke="oklch(0.72 0.14 175 / 0.2)" strokeWidth="0.4" className="cc-holo-ring" />

          {ROUTES.map(([a, b], i) => {
            const from = nodeMap[a];
            const to = nodeMap[b];
            const path = `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${from.y - 8} ${to.x} ${to.y}`;
            return (
              <g key={`${a}-${b}`}>
                <path d={path} stroke="url(#ccRoute)" strokeWidth="0.35" fill="none" opacity="0.35" filter="url(#ccGlow)" />
                <path d={path} stroke="oklch(0.78 0.16 175)" strokeWidth="0.25" fill="none" className="cc-route-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                <path id={`route-${i}`} d={path} fill="none" stroke="none" />
              </g>
            );
          })}

          {/* Grain ship */}
          <g className="cc-ship" transform="translate(0,0)">
            <circle r="0.6" fill="oklch(0.78 0.16 175)">
              <animateMotion dur="14s" repeatCount="indefinite" path="M 62 58 Q 64 52 66 54" />
            </circle>
          </g>
          {/* Delivery drone */}
          <g className="cc-drone">
            <circle r="0.45" fill="oklch(0.72 0.14 195)">
              <animateMotion dur="9s" repeatCount="indefinite" path="M 58 48 Q 62 52 60 62" />
            </circle>
          </g>

          {NODES.map((n) => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <circle r="2.2" fill="oklch(0.78 0.16 175 / 0.15)" className="cc-ping-ring" />
              <circle r="1" fill="oklch(0.78 0.16 175)" filter="url(#ccGlow)" />
              <circle r="1.8" fill="none" stroke="oklch(0.78 0.16 175)" strokeWidth="0.15" className="cc-ping-ring" style={{ animationDelay: "0.5s" }} />
              <text y="-2.8" textAnchor="middle" fontSize="1.8" fill="oklch(0.95 0.02 200)" fontWeight="600">
                {n.label}
              </text>
              <text y="-0.8" textAnchor="middle" fontSize="1.2" fill="oklch(0.72 0.14 175)">
                {n.status}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="cc-badge flex items-center gap-1">
            <Ship className="h-3 w-3" /> Grain Ship
          </span>
          <span className="cc-badge flex items-center gap-1">
            <Plane className="h-3 w-3" /> Delivery Drone
          </span>
        </div>

        <div className="cc-legend absolute bottom-3 right-3 max-w-[200px] rounded-lg border border-white/10 bg-black/60 p-3 text-[10px]">
          <div className="font-semibold uppercase tracking-wider text-cc-accent">Legenda · Legend</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>
              <span className="text-foreground font-mono">{inTransit || 4}</span> Pengiriman Aktif
            </li>
            <li>
              <span className="text-foreground font-mono">{onChain || 16}</span> Verified On-Chain
            </li>
            <li>
              <span className="text-foreground font-mono">{countries || 3}</span> Negara Peserta
            </li>
          </ul>
        </div>
      </div>
    </GlassPanel>
  );
}
