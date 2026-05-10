import { useMemo, useEffect, useState, type ReactNode } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { toast } from "sonner";

import "@solana/wallet-adapter-react-ui/styles.css";

export function PhantomProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Render children plain on the server / first paint to avoid window access during SSR.
  if (!mounted) return <>{children}</>;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={(e) => toast.error(e.message || "Wallet error")}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

/**
 * Backwards-compatible hook that mirrors the previous custom Phantom context API.
 * Internally uses Solana Wallet Adapter.
 */
export function usePhantom() {
  const wallet = useWallet();
  const modal = useWalletModal();
  const publicKey = wallet.publicKey ? wallet.publicKey.toString() : null;

  return {
    publicKey,
    connecting: wallet.connecting,
    installed: !!wallet.wallet,
    connect: async () => {
      if (!wallet.wallet) {
        modal.setVisible(true);
        return;
      }
      try {
        await wallet.connect();
      } catch {
        toast.error("Gagal menghubungkan wallet");
      }
    },
    disconnect: async () => {
      try {
        await wallet.disconnect();
        toast.success("Wallet diputus");
      } catch {
        /* noop */
      }
    },
  };
}
