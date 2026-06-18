import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ArrowRightLeft, Loader2, Smartphone, ShieldCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBatches } from "@/lib/batches-context";
import { usePhantom } from "@/lib/phantom-context";
import type { Batch } from "@/lib/mock-data";
import { toast } from "sonner";

const schema = z.object({
  actor: z.string().trim().min(2, "Min. 2 karakter").max(80),
  location: z.string().trim().min(2, "Min. 2 karakter").max(80),
  wallet: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal("")),
});

export function HandoverDialog({
  batch,
  open,
  onOpenChange,
}: {
  batch: Batch | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { handover, nextStatusOf } = useBatches();
  const { publicKey } = usePhantom();
  const [actor, setActor] = useState("");
  const [location, setLocation] = useState("");
  const [wallet, setWallet] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const code = useMemo(
    () => (batch ? `GFL-${batch.id}-${Math.random().toString(36).slice(2, 7).toUpperCase()}` : ""),
    [batch?.id, open]
  );

  useEffect(() => {
    if (open) {
      setActor("");
      setLocation("");
      setWallet(publicKey ?? "");
      setErrors({});
    }
  }, [open, publicKey]);

  if (!batch) return null;
  const next = nextStatusOf(batch.status);
  const canHandover = !!next;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ actor, location, wallet });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    const status = handover(batch.id, {
      actor: parsed.data.actor,
      location: parsed.data.location,
      wallet: parsed.data.wallet ?? "",
    });
    setBusy(false);
    if (status) {
      toast.success(`Custody dipindahkan → ${status}`, {
        description: `Batch #${batch.id} kini dipegang oleh ${parsed.data.actor}`,
      });
    }
    onOpenChange(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Tidak bisa menyalin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" /> Handover Device
          </DialogTitle>
          <DialogDescription>
            Pindahkan custody Batch <span className="font-mono">#{batch.id}</span>{" "}
            {next ? (
              <>
                dari <span className="font-semibold">{batch.status}</span> → <span className="font-semibold text-primary">{next}</span>.
              </>
            ) : (
              <>Batch sudah <span className="font-semibold">Delivered</span> — tidak ada handover berikutnya.</>
            )}
          </DialogDescription>
        </DialogHeader>

        {canHandover ? (
          <form onSubmit={submit} className="grid gap-3">
            <div className="rounded-lg border bg-gradient-subtle p-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5" /> Pairing code
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="font-mono text-base font-bold tracking-wider text-chain">{code}</span>
                <Button type="button" size="sm" variant="ghost" onClick={copyCode} className="h-7 gap-1">
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Tersalin" : "Salin"}
                </Button>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Bagikan kode ini ke device penerima untuk verifikasi serah-terima.
              </p>
            </div>

            <Field
              label="Penerima (Aktor / Perusahaan)"
              value={actor}
              onChange={setActor}
              placeholder="PT Logistik Nusantara"
              error={errors.actor}
            />
            <Field
              label="Lokasi Saat Ini"
              value={location}
              onChange={setLocation}
              placeholder="Pelabuhan Tanjung Priok"
              error={errors.location}
            />
            <Field
              label="Wallet Penerima (opsional)"
              value={wallet}
              onChange={setWallet}
              placeholder="0x... (auto-generate jika kosong)"
              error={errors.wallet}
            />

            <DialogFooter className="mt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={busy} className="gap-2 bg-gradient-primary text-primary-foreground">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {busy ? "Menandatangani…" : "Konfirmasi Handover"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <Button onClick={() => onOpenChange(false)} className="mt-2 w-full">
            Tutup
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={error ? "border-destructive" : ""}
      />
      {error && <span className="text-[11px] text-destructive">{error}</span>}
    </div>
  );
}
