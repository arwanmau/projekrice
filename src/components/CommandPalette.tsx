import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { LayoutGrid, QrCode, Radio, Sparkles, Crown, Sun, Moon, LogOut, Search } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useDevice, type DeviceMode } from "@/lib/device-context";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toggle, theme } = useTheme();
  const { user, logout } = useAuth();
  const { setDevice } = useDevice();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  const setDev = (d: DeviceMode) => {
    setDevice(d);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden lg:inline-flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Quick search…</span>
        <kbd className="ml-2 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari halaman, aksi, atau perintah…" />
        <CommandList>
          <CommandEmpty>Tidak ada hasil.</CommandEmpty>
          <CommandGroup heading="Navigasi">
            <CommandItem onSelect={() => go("/")}><LayoutGrid className="mr-2 h-4 w-4" />Dashboard</CommandItem>
            <CommandItem onSelect={() => go("/live")}><Radio className="mr-2 h-4 w-4" />Live Map</CommandItem>
            <CommandItem onSelect={() => go("/insights")}><Sparkles className="mr-2 h-4 w-4" />AI Insights</CommandItem>
            <CommandItem onSelect={() => go("/scan")}><QrCode className="mr-2 h-4 w-4" />Scan QR</CommandItem>
            {user?.isAdmin && (
              <CommandItem onSelect={() => go("/admin")}>
                <Crown className="mr-2 h-4 w-4" />
                Admin Dashboard & Analytics
              </CommandItem>
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Preview Device">
            <CommandItem onSelect={() => setDev("desktop")}><Monitor className="mr-2 h-4 w-4" />Desktop</CommandItem>
            <CommandItem onSelect={() => setDev("tablet")}><Tablet className="mr-2 h-4 w-4" />Tablet</CommandItem>
            <CommandItem onSelect={() => setDev("mobile")}><Smartphone className="mr-2 h-4 w-4" />Mobile</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tindakan">
            <CommandItem onSelect={() => { toggle(); setOpen(false); }}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Toggle theme
            </CommandItem>
            {user && (
              <CommandItem onSelect={() => { logout(); setOpen(false); navigate({ to: "/login" }); }}>
                <LogOut className="mr-2 h-4 w-4" />Log out
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
