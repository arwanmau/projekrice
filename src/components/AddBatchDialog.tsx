import { useState } from "react";
import { z } from "zod";
import { Plus, Sprout, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBatches } from "@/lib/batches-context";
import { usePhantom } from "@/lib/phantom-context";
import { toast } from "sonner";

const schema = z.object({
  product: z.string().trim().min(2, "Min. 2 karakter").max(40),
  variety: z.string().trim().min(2, "Min. 2 karakter").max(60),
  weightKg: z.coerce.number().int().positive("Harus > 0").max(10_000_000),
  farm: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(60),
  country: z.string().trim().min(2).max(60),
  farmer: z.string().trim().min(2).max(80),
});

const EMPTY = {
  product: "",
  variety: "",
  weightKg: "",
  farm: "",
  region: "",
  country: "",
  farmer: "",
};

export function AddBatchDialog() {
  const { addBatch } = useBatches();
  const { publicKey, connect, connecting } = usePhantom();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }
    const signer = publicKey ?? (await connect());
    if (!signer) return;

    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    const b = addBatch({ ...parsed.data, signerWallet: signer });
    setBusy(false);
    toast.success(`Batch #${b.id} dicatat on-chain`, { description: b.txHash.slice(0, 26) + "…" });
    setForm(EMPTY);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 gap-2 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
          <Plus className="h-4 w-4" /> Tambah Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" /> Daftarkan Batch Baru
          </DialogTitle>
          <DialogDescription>
            Isi detail panen. Sistem akan mencatat <span className="text-chain">genesis transaction</span> ke ledger.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Produk" name="product" value={form.product} onChange={set} error={errors.product} placeholder="Rice" />
            <Field label="Varietas" name="variety" value={form.variety} onChange={set} error={errors.variety} placeholder="IR64" />
          </div>
          <Field
            label="Berat (kg)"
            name="weightKg"
            type="number"
            value={form.weightKg}
            onChange={set}
            error={errors.weightKg}
            placeholder="12000"
          />
          <Field label="Nama Petani" name="farmer" value={form.farmer} onChange={set} error={errors.farmer} placeholder="Pak Budi" />
          <Field label="Nama Kebun / Koperasi" name="farm" value={form.farm} onChange={set} error={errors.farm} placeholder="Sawah Hijau Co." />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Wilayah" name="region" value={form.region} onChange={set} error={errors.region} placeholder="Karawang" />
            <Field label="Negara" name="country" value={form.country} onChange={set} error={errors.country} placeholder="Indonesia" />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={busy || connecting}
              className="gap-2 bg-gradient-primary text-primary-foreground"
            >
              {busy || connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
              {busy ? "Mencatat ke Solana…" : connecting ? "Menghubungkan…" : "Daftarkan & Mint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (k: string, v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name} className="text-xs">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={error ? "border-destructive" : ""}
      />
      {error && <span className="text-[11px] text-destructive">{error}</span>}
    </div>
  );
}
