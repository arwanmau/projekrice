import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, ShieldCheck, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Global Food Ledger" },
      { name: "description", content: "Masuk ke dashboard rantai pasok terdesentralisasi." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("budi.santoso@sawahhijau.id");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate({ to: "/" });
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login berhasil", { description: "Selamat datang kembali." });
      navigate({ to: "/" });
    } catch {
      toast.error("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/20">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="text-base font-bold tracking-tight">Global Food Ledger</div>
        </Link>

        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight">
            Dari sawah ke rak — <br /> tercatat selamanya di blockchain.
          </h1>
          <p className="mt-3 max-w-md text-sm opacity-90">
            Lacak setiap batch pangan staple dengan transparansi penuh, jaminan smart contract,
            dan keamanan jaringan Polygon.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" /> Secured by Polygon
          </div>
        </div>

        <div className="relative text-xs opacity-80">© 2026 Global Food Ledger</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-bold">Global Food Ledger</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Selamat datang</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk mengakses dashboard rantai pasok.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anda@toko.id"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Lupa password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><LogIn className="h-4 w-4" /> Masuk</>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Demo: gunakan email & password apa saja.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
