import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Leaf, LayoutGrid, QrCode, ShieldCheck, Sun, Moon, LogOut, LogIn, Radio, Sparkles, Crown } from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";
import { DeviceSwitcher } from "./DeviceSwitcher";
import { BackToDesktopButton } from "./BackToDesktopButton";
import { useDevice } from "@/lib/device-context";
import { WalletStatusBar } from "@/components/command-center/WalletStatusBar";
import { PhantomButton } from "./PhantomButton";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Dashboard", labelId: "Pusat Kendali", Icon: LayoutGrid },
  { to: "/live", label: "Live Map", labelId: "Peta Langsung", Icon: Radio },
  { to: "/insights", label: "AI Insights", labelId: "Wawasan AI", Icon: Sparkles },
  { to: "/scan", label: "Scan", labelId: "Pindai", Icon: QrCode },
] as const;

export function AppHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { device } = useDevice();
  const navigate = useNavigate();
  const isCC = ["/", "/live", "/insights", "/scan"].includes(path);
  const isPreviewMode = device !== "desktop";

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    navigate({ to: "/login" });
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${isCC ? "cc-header" : "border-b bg-background"}`}>
      <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center justify-between gap-3 px-4">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <div className="cc-brand-glow relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold tracking-tight sm:text-base">Global Food Ledger</div>
            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-2.5 w-2.5 shrink-0 text-cc-accent" />
              <span className="truncate">Secured by Solana</span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map(({ to, label, labelId, Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                className={`cc-nav-link flex flex-col items-center rounded-lg px-3 py-1.5 ${
                  active ? "cc-nav-link--active" : "text-muted-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
                <span className="text-[9px] font-medium opacity-70">{labelId}</span>
              </Link>
            );
          })}
          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`cc-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                path === "/admin" ? "cc-nav-link--active" : "text-muted-foreground"
              }`}
            >
              <Crown className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1">
          {isPreviewMode ? (
            <BackToDesktopButton compact className="md:hidden" />
          ) : null}
          <DeviceSwitcher />
          {isPreviewMode ? (
            <BackToDesktopButton className="hidden md:flex" />
          ) : null}
          {isCC ? <WalletStatusBar /> : <PhantomButton />}
          {user && <RoleSwitcher />}

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="h-9 w-9">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cc-brand-glow grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground transition-transform hover:scale-105">
                  {user.avatar}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="leading-tight">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="truncate text-[11px] font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              className="h-9 gap-1.5 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav — horizontal swipe */}
      <nav className="cc-mobile-nav-scroll flex gap-1 overflow-x-auto border-t border-white/5 px-2 py-1.5 md:hidden">
        {NAV.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={`cc-nav-link flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium ${
              path === to ? "cc-nav-link--active" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
