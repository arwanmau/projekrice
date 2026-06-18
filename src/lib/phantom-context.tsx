import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import {
  fetchSolBalance,
  getPhantomProvider,
  openPhantomInstall,
  SOLANA_NETWORK,
  type PhantomSolanaProvider,
} from "@/utils/solana";

type Ctx = {
  publicKey: string | null;
  balance: number | null;
  connecting: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => Promise<void>;
  installed: boolean;
  network: typeof SOLANA_NETWORK;
};

const PhantomContext = createContext<Ctx | null>(null);

async function refreshBalance(address: string | null, setBalance: (n: number | null) => void) {
  if (!address) {
    setBalance(null);
    return;
  }
  setBalance(await fetchSolBalance(address));
}

function readConnectedKey(provider: PhantomSolanaProvider): string | null {
  if (provider.isConnected && provider.publicKey) {
    return provider.publicKey.toString();
  }
  return null;
}

export function PhantomProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [installed, setInstalled] = useState(false);
  const providerRef = useRef<PhantomSolanaProvider | null>(null);

  const syncKey = useCallback((key: string | null) => {
    setPublicKey(key);
    void refreshBalance(key, setBalance);
  }, []);

  const bindProvider = useCallback(
    (provider: PhantomSolanaProvider) => {
      if (providerRef.current === provider) return;
      providerRef.current = provider;
      setInstalled(true);

      const existing = readConnectedKey(provider);
      if (existing) syncKey(existing);

      provider
        .connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => syncKey(publicKey.toString()))
        .catch(() => {});

      const onConnect = () => {
        const key = readConnectedKey(provider);
        if (key) syncKey(key);
      };
      const onDisconnect = () => syncKey(null);
      const onAccountChanged = (...args: unknown[]) => {
        const pk = args[0] as { toString: () => string } | null;
        syncKey(pk ? pk.toString() : null);
      };

      provider.on("connect", onConnect);
      provider.on("disconnect", onDisconnect);
      provider.on("accountChanged", onAccountChanged);
    },
    [syncKey]
  );

  useEffect(() => {
    const tryBind = () => {
      const provider = getPhantomProvider();
      if (provider) bindProvider(provider);
    };

    tryBind();

    const interval = window.setInterval(() => {
      if (getPhantomProvider()) {
        tryBind();
        window.clearInterval(interval);
      }
    }, 200);

    const stopPolling = window.setTimeout(() => window.clearInterval(interval), 10_000);
    window.addEventListener("load", tryBind);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stopPolling);
      window.removeEventListener("load", tryBind);
      const p = providerRef.current;
      p?.removeAllListeners?.("connect");
      p?.removeAllListeners?.("disconnect");
      p?.removeAllListeners?.("accountChanged");
      providerRef.current = null;
    };
  }, [bindProvider]);

  const connect = useCallback(async (): Promise<string | null> => {
    const provider = getPhantomProvider() ?? providerRef.current;
    if (!provider) {
      openPhantomInstall();
      toast.error("Phantom belum terdeteksi", {
        description: "Pasang ekstensi Phantom, refresh halaman, lalu klik Connect lagi.",
      });
      return null;
    }
    bindProvider(provider);

    const existing = readConnectedKey(provider);
    if (existing) {
      syncKey(existing);
      return existing;
    }

    setConnecting(true);
    try {
      const res = await provider.connect();
      const addr = res.publicKey.toString();
      syncKey(addr);
      toast.success("Phantom terhubung", {
        description: `${addr.slice(0, 4)}…${addr.slice(-4)} · ${SOLANA_NETWORK}`,
      });
      return addr;
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 4001) {
        toast.info("Koneksi dibatalkan", { description: "Buka Phantom dan setujui permintaan Connect." });
      } else {
        toast.error("Gagal menghubungkan Phantom", {
          description: "Pastikan ekstensi aktif dan situs ini diizinkan di Phantom.",
        });
      }
      return null;
    } finally {
      setConnecting(false);
    }
  }, [bindProvider, syncKey]);

  const disconnect = useCallback(async () => {
    const provider = getPhantomProvider() ?? providerRef.current;
    if (!provider) return;
    await provider.disconnect();
    syncKey(null);
    toast.success("Phantom diputus");
  }, [syncKey]);

  return (
    <PhantomContext.Provider
      value={{ publicKey, balance, connecting, connect, disconnect, installed, network: SOLANA_NETWORK }}
    >
      {children}
    </PhantomContext.Provider>
  );
}

export function usePhantom() {
  const ctx = useContext(PhantomContext);
  if (!ctx) throw new Error("usePhantom must be used within PhantomProvider");
  return ctx;
}
