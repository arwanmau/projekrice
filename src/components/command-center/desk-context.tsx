import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type HighlightNode = "farm" | "plant" | "port" | "market" | null;

type DeskCtx = {
  routeOptimized: boolean;
  routeDisrupted: boolean;
  highlightNode: HighlightNode;
  aiPulse: number;
  setHighlightNode: (n: HighlightNode) => void;
  triggerRouteOptimize: () => void;
};

const DeskContext = createContext<DeskCtx | null>(null);

export function DeskProvider({ children }: { children: ReactNode }) {
  const [routeOptimized, setRouteOptimized] = useState(false);
  const [routeDisrupted, setRouteDisrupted] = useState(true);
  const [highlightNode, setHighlightNode] = useState<HighlightNode>(null);
  const [aiPulse, setAiPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAiPulse((p) => p + 1), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setRouteOptimized(true);
      setRouteDisrupted(false);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const triggerRouteOptimize = () => {
    setRouteOptimized(true);
    setRouteDisrupted(false);
  };

  return (
    <DeskContext.Provider
      value={{
        routeOptimized,
        routeDisrupted,
        highlightNode,
        aiPulse,
        setHighlightNode,
        triggerRouteOptimize,
      }}
    >
      {children}
    </DeskContext.Provider>
  );
}

export function useDesk() {
  const ctx = useContext(DeskContext);
  if (!ctx) throw new Error("useDesk must be used within DeskProvider");
  return ctx;
}
