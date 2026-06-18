import { Wallet, Loader2 } from "lucide-react";
import { usePhantom } from "@/lib/phantom-context";
import { Button } from "@/components/ui/button";

export function WalletStatusBar() {
  const { publicKey, balance, connecting, connect, network } = usePhantom();

  if (!publicKey) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={connect}
        disabled={connecting}
        className="cc-wallet-bar h-8 gap-1.5 border-cc-accent/30 text-xs"
      >
        {connecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wallet className="h-3 w-3" />}
        Connect Wallet
      </Button>
    );
  }

  const short = `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}`;
  const sol = balance !== null ? balance.toFixed(4) : "—";

  return (
    <div className="cc-wallet-bar flex items-center gap-2 rounded-lg border border-cc-accent/25 px-3 py-1.5 font-mono text-xs">
      <Wallet className="h-3.5 w-3.5 text-cc-accent" />
      <span className="font-semibold text-foreground">{short}</span>
      <span className="h-3 w-px bg-white/15" />
      <span className="text-cc-accent">{sol} SOL</span>
      <span className="text-[10px] uppercase text-muted-foreground">{network}</span>
    </div>
  );
}
