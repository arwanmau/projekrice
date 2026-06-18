import { useBatches } from "@/lib/batches-context";
import { useDesk } from "./desk-context";
import { GlassPanel } from "./GlassPanel";
import { Globe2, Ship, Plane } from "lucide-react";

const NODES = [
  { id: "farm" as const, label: "Jatiwangi Harvest Farm", status: "ACTIVE", lat: 28, lng: 72 },
  { id: "plant" as const, label: "Vietnam Processing Plant", status: "ACTIVE", lat: 42, lng: 68 },
  { id: "port" as const, label: "Pelabuhan Surabaya", status: "ACTIVE", lat: 52, lng: 78 },
  { id: "market" as const, label: "Pasar Jakarta Hub", status: "ACTIVE", lat: 38, lng: 58 },
];

const ROUTES = [
  { from: "farm", to: "port", id: "r1" },
  { from: "plant", to: "port", id: "r2", optimizable: true },
  { from: "port", to: "market", id: "r3" },
];

export function SupplyChainSphere() {
  const { batches } = useBatches();
  const { routeOptimized, routeDisrupted, highlightNode } = useDesk();
  const active = batches.filter((b) => b.status === "In Transit").length || 4;
  const onChain = batches.reduce((a, b) => a + b.timeline.length, 0) || 16;

  return (
    <GlassPanel
      glow
      title="Live Global Supply Chain Sphere"
      subtitle="Integrated Global Food Ledger Rantai Pasok"
      icon={<Globe2 className="h-4 w-4 text-cc-accent" />}
      className="cc-module-sphere"
    >
      <div className="relative flex min-h-[320px] items-center justify-center p-4 sm:min-h-[380px]">
        <div className="cc-sphere-stage relative h-56 w-56 sm:h-64 sm:w-64">
          <div className="cc-sphere-globe absolute inset-0 rounded-full" />
          <div className="cc-sphere-grid absolute inset-2 rounded-full opacity-40" />
          <div className="cc-sphere-lights absolute inset-0 rounded-full" />

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {ROUTES.map((r) => {
              const a = NODES.find((n) => n.id === r.from)!;
              const b = NODES.find((n) => n.id === r.to)!;
              const isOpt = r.optimizable && routeOptimized;
              const disrupted = r.optimizable && routeDisrupted && !routeOptimized;
              const stroke = isOpt
                ? "oklch(0.78 0.16 175)"
                : disrupted
                  ? "oklch(0.72 0.18 55)"
                  : "oklch(0.55 0.12 195)";
              return (
                <line
                  key={r.id}
                  x1={a.lng}
                  y1={a.lat}
                  x2={b.lng}
                  y2={b.lat}
                  stroke={stroke}
                  strokeWidth="1.2"
                  className={isOpt ? "cc-route-optimal" : disrupted ? "cc-route-warn" : ""}
                  opacity="0.85"
                />
              );
            })}
            {NODES.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.lng}
                  cy={n.lat}
                  r={highlightNode === n.id ? 4 : 2.5}
                  fill={highlightNode === n.id ? "oklch(0.78 0.16 175)" : "oklch(0.72 0.14 195)"}
                  className="cc-sphere-node"
                />
              </g>
            ))}
          </svg>

          <div className="cc-ship-orb absolute left-[18%] top-[45%]">
            <Ship className="h-3 w-3 text-cc-accent" />
          </div>
          <div className="cc-drone-orb absolute right-[22%] top-[30%]">
            <Plane className="h-2.5 w-2.5 text-cc-accent" />
          </div>
        </div>

        <div className="cc-float-panel absolute left-3 top-14 max-w-[140px]">
          <div className="text-[9px] font-bold uppercase text-cc-accent">Pengiriman Aktif</div>
          <div className="font-mono text-lg font-bold">{active}</div>
        </div>
        <div className="cc-float-panel absolute right-3 top-14 max-w-[140px] text-right">
          <div className="text-[9px] font-bold uppercase text-cc-accent">Verified On-Chain</div>
          <div className="font-mono text-lg font-bold">{onChain}</div>
        </div>

        <ul className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          {NODES.map((n) => (
            <li
              key={n.id}
              className={`cc-node-tag text-[9px] ${highlightNode === n.id ? "cc-node-tag--active" : ""}`}
            >
              {n.label} · {n.status}
            </li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
}
