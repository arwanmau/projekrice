import { Wallet, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhantom } from "@/lib/phantom-context";
import { shortenAddress } from "@/utils/solana";

export function PhantomConnectBanner() {
  const { publicKey, balance, connecting, connect, disconnect, installed, network } = usePhantom();

  if (publicKey) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-chain/30 bg-chain/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-chain/15 text-chain">
            <Wallet className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Phantom terhubung</p>
            <p className="font-mono text-xs text-muted-foreground">
              {shortenAddress(publicKey, 6)}
              {balance !== null && ` · ${balance.toFixed(4)} SOL`}
              {" · "}
              {network}
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={disconnect} className="shrink-0">
          Putuskan
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-chain/40 bg-gradient-to-r from-chain/5 to-transparent px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Hubungkan Phantom Anda</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {installed
            ? "Klik Connect — popup Phantom akan meminta persetujuan untuk situs ini."
            : "Pasang ekstensi Phantom di browser, lalu refresh halaman ini."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {!installed && (
          <Button size="sm" variant="outline" asChild className="gap-1.5">
            <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Install Phantom
            </a>
          </Button>
        )}
        <Button
          size="sm"
          onClick={connect}
          disabled={connecting}
          className="gap-1.5 bg-[#AB9FF2] text-white hover:bg-[#9b8ee8]"
        >
          {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
          {connecting ? "Menunggu Phantom…" : "Connect Phantom"}
        </Button>
      </div>
    </div>
  );
}
