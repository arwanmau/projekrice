import { Wallet, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePhantom } from "@/lib/phantom-context";
import { toast } from "sonner";

export function PhantomButton() {
  const { publicKey, balance, connecting, connect, disconnect, network } = usePhantom();

  if (!publicKey) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={connect}
        disabled={connecting}
        className="h-9 gap-1.5 border-chain/40 text-chain hover:bg-chain/10 hover:text-chain"
      >
        {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
        <span className="hidden sm:inline">{connecting ? "Menunggu Phantom…" : "Connect Phantom"}</span>
      </Button>
    );
  }

  const short = `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 border-chain/40 text-chain hover:bg-chain/10 hover:text-chain">
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-xs">{short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="leading-tight">
          <div className="text-xs font-semibold">Phantom · Solana {network}</div>
          <div className="mt-1 break-all font-mono text-[10px] font-normal text-muted-foreground">{publicKey}</div>
          {balance !== null && (
            <div className="mt-1 text-[10px] font-normal text-muted-foreground">
              Saldo: {balance.toFixed(4)} SOL
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(publicKey);
            toast.success("Address disalin");
          }}
          className="gap-2"
        >
          <Wallet className="h-4 w-4" /> Salin address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="gap-2 text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
