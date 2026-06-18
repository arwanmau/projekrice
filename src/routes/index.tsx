import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { CommandCenterShell } from "@/components/command-center/CommandCenterShell";
import { HolographicCommandDesk } from "@/components/command-center/HolographicCommandDesk";
import { PhantomConnectBanner } from "@/components/PhantomConnectBanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — Global Food Ledger" },
      {
        name: "description",
        content: "Holographic unified command desk for global food supply chain on Solana.",
      },
    ],
  }),
  component: CommandCenterDashboard,
});

function CommandCenterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <CommandCenterShell>
      <AppHeader />
      <PhantomConnectBanner />
      <HolographicCommandDesk />
    </CommandCenterShell>
  );
}
