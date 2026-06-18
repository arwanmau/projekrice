import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { BATCHES, type Batch, type BatchStatus, type TimelineStep } from "./mock-data";
import { mockSolanaSignature, shortenAddress } from "@/utils/solana";

const STORAGE_KEY = "gfl.batches.v1";

const NEXT_STATUS: Record<BatchStatus, BatchStatus | null> = {
  Harvested: "Inspected",
  Inspected: "In Transit",
  "In Transit": "Warehoused",
  Warehoused: "Delivered",
  Delivered: null,
  "Pending Escrow": "In Transit",
};

type AddBatchInput = {
  product: string;
  variety: string;
  weightKg: number;
  farm: string;
  region: string;
  country: string;
  farmer: string;
  /** Alamat Phantom / Solana yang menandatangani genesis tx. */
  signerWallet?: string;
};

type HandoverInput = {
  actor: string;
  location: string;
  wallet: string;
};

type Ctx = {
  batches: Batch[];
  addBatch: (input: AddBatchInput) => Batch;
  handover: (batchId: string, input: HandoverInput) => BatchStatus | null;
  removeBatch: (batchId: string) => void;
  nextStatusOf: (s: BatchStatus) => BatchStatus | null;
};

const BatchesContext = createContext<Ctx | null>(null);

const randHex = (n = 32) =>
  Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");

const shortWallet = () => `0x${randHex(4)}...${randHex(4)}`;
const txHash = () => `0x${randHex(40)}`;

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())} UTC`;
};

export function BatchesProvider({ children }: { children: ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(BATCHES);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setBatches(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    } catch {
      /* ignore */
    }
  }, [batches]);

  const addBatch: Ctx["addBatch"] = (input) => {
    const code = input.product.replace(/[^A-Z]/gi, "").slice(0, 5).toUpperCase() || "ITEM";
    const id = `${code}-${Math.floor(1000 + Math.random() * 9000)}`;
    const onSolana = !!input.signerWallet;
    const wallet = onSolana ? shortenAddress(input.signerWallet!, 6) : shortWallet();
    const tx = onSolana ? mockSolanaSignature() : txHash();
    const stamp = nowStamp();
    const newBatch: Batch = {
      id,
      product: input.product,
      variety: input.variety,
      weightKg: input.weightKg,
      status: "Harvested",
      location: `${input.region}, ${input.country}`,
      timestamp: stamp,
      txHash: tx,
      origin: {
        farm: input.farm,
        region: input.region,
        country: input.country,
        coords: "—",
        farmer: input.farmer,
        harvestDate: stamp.split(" ")[0],
      },
      timeline: [
        {
          status: "Harvested",
          actor: input.farmer,
          location: `${input.region}, ${input.country}`,
          timestamp: stamp,
          txHash: tx,
          wallet,
        },
      ],
    };
    setBatches((prev) => [newBatch, ...prev]);
    return newBatch;
  };

  const handover: Ctx["handover"] = (batchId, input) => {
    let outStatus: BatchStatus | null = null;
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        const next = NEXT_STATUS[b.status];
        if (!next) return b;
        const stamp = nowStamp();
        const step: TimelineStep = {
          status: next,
          actor: input.actor,
          location: input.location,
          timestamp: stamp,
          txHash: txHash(),
          wallet: input.wallet ? shortenAddress(input.wallet, 6) : shortWallet(),
        };
        outStatus = next;
        return {
          ...b,
          status: next,
          location: input.location,
          timestamp: stamp,
          txHash: step.txHash,
          timeline: [...b.timeline, step],
        };
      })
    );
    return outStatus;
  };

  const removeBatch: Ctx["removeBatch"] = (batchId) => {
    setBatches((prev) => prev.filter((b) => b.id !== batchId));
  };

  return (
    <BatchesContext.Provider
      value={{ batches, addBatch, handover, removeBatch, nextStatusOf: (s) => NEXT_STATUS[s] }}
    >
      {children}
    </BatchesContext.Provider>
  );
}

export function useBatches() {
  const ctx = useContext(BatchesContext);
  if (!ctx) throw new Error("useBatches must be used inside <BatchesProvider>");
  return ctx;
}
