import { DeskProvider } from "./desk-context";
import { DataThreads } from "./DataThreads";
import { MetricsStorePanel } from "./MetricsStorePanel";
import { SupplyChainSphere } from "./SupplyChainSphere";
import { AICommandCore } from "./AICommandCore";
import { ScanAuthHub } from "./ScanAuthHub";
import { IntegratedLedger } from "./IntegratedLedger";
import { AddBatchDialog } from "@/components/AddBatchDialog";
import { MobileSwipeCarousel } from "@/components/MobileSwipeCarousel";
import { ShieldCheck } from "lucide-react";

const DESK_SLIDES = [
  { id: "metrics", label: "Metrik & Toko", Panel: MetricsStorePanel },
  { id: "sphere", label: "Rantai Pasok 3D", Panel: SupplyChainSphere },
  { id: "ai", label: "AI Command Core", Panel: AICommandCore },
  { id: "scan", label: "Pindai & Verifikasi", Panel: ScanAuthHub },
  { id: "ledger", label: "Ledger Terintegrasi", Panel: IntegratedLedger },
] as const;

export function HolographicCommandDesk() {
  return (
    <DeskProvider>
      <div className="cc-desk-perspective px-4 pb-10 pt-2 sm:px-6">
        <div className="cc-desk-tagline mb-4 text-center animate-fade-up">
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">
            Pusat Kendali Global Food Ledger Terintegrasi
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Traceability · Transparansi · Keamanan · Efisiensi
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="cc-badge inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Solana Devnet · Live
            </span>
            <AddBatchDialog />
          </div>
        </div>

        <div className="cc-desk-table relative animate-fade-up">
          <DataThreads />
          <div className="relative z-10 lg:hidden">
            <MobileSwipeCarousel
              slides={DESK_SLIDES.map(({ id, label, Panel }) => ({
                id,
                label,
                children: <Panel />,
              }))}
            />
          </div>
          <div className="cc-desk-grid relative z-10 hidden lg:grid">
            <MetricsStorePanel />
            <SupplyChainSphere />
            <AICommandCore />
            <ScanAuthHub />
            <IntegratedLedger />
          </div>
        </div>
      </div>
    </DeskProvider>
  );
}
