import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

export type SolanaNetwork = "devnet" | "mainnet-beta";

/** Jaringan Solana yang dipakai aplikasi (ubah ke mainnet-beta untuk produksi). */
export const SOLANA_NETWORK: SolanaNetwork = "devnet";

export function getConnection(): Connection {
  return new Connection(clusterApiUrl(SOLANA_NETWORK), "confirmed");
}

export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

export async function fetchSolBalance(address: string): Promise<number | null> {
  try {
    const lamports = await getConnection().getBalance(new PublicKey(address));
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return null;
  }
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** Simulasi signature Solana (base58) untuk demo ledger lokal. */
export function mockSolanaSignature(): string {
  return Array.from({ length: 88 }, () => BASE58[Math.floor(Math.random() * BASE58.length)]).join("");
}

export type PhantomSolanaProvider = {
  isPhantom?: boolean;
  publicKey: { toString: () => string } | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  removeAllListeners?: (event?: string) => void;
};

declare global {
  interface Window {
    solana?: PhantomSolanaProvider;
    phantom?: { solana?: PhantomSolanaProvider };
  }
}

export function getPhantomProvider(): PhantomSolanaProvider | null {
  if (typeof window === "undefined") return null;
  const provider = window.phantom?.solana ?? window.solana;
  return provider?.isPhantom ? provider : null;
}

export function openPhantomInstall(): void {
  window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
}
